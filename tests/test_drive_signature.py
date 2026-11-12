"""Browser checks for the homepage's video-based Drive signature.

Requires Hugo, Python Playwright, and Google Chrome installed locally.
Run with: python -m unittest discover -s tests
"""

import socket
import subprocess
import time
import tomllib
import unittest
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
THEMES = {
    "cyan-crystal": "青色菱晶", "violet-energy-ring": "紫色能量环",
    "cyan-pink-wings": "青粉双翼", "red-gold-pixels": "红金像素环",
    "green-waveform": "绿色均衡器", "silver-blue-polygon": "银蓝多边形",
    "pink-violet-ring": "粉紫能量环", "red-trail": "红黑拖尾",
    "orange-flame": "橙色火焰", "blue-violet-tech": "蓝紫斜切科技",
}


class DriveSignatureBrowserTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            port = listener.getsockname()[1]
        cls.base = f"http://127.0.0.1:{port}/Anfinsen-s-Blog/"
        cls.server = subprocess.Popen(
            ["hugo", "server", "--bind", "127.0.0.1", "--port", str(port),
             "--baseURL", cls.base, "--appendPort=false", "--disableFastRender"],
            cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        try:
            local_http = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            for _ in range(100):
                if cls.server.poll() is not None:
                    raise RuntimeError("Hugo server exited before becoming ready")
                try:
                    with local_http.open(cls.base, timeout=1):
                        break
                except OSError:
                    time.sleep(0.1)
            else:
                raise RuntimeError("Hugo server did not become ready")
            cls.playwright = sync_playwright().start()
            cls.browser = cls.playwright.chromium.launch(channel="chrome", headless=True)
        except Exception:
            cls.server.terminate()
            cls.server.wait(timeout=10)
            raise

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.terminate()
        cls.server.wait(timeout=10)

    def test_homepage_renders_and_animates_video_signature_on_desktop_and_mobile(self):
        config = tomllib.loads((ROOT / "hugo.toml").read_text(encoding="utf-8"))["params"]["driveSignature"]
        variant = config.get("variant")
        if not config.get("enabled") or variant not in (*THEMES, "video-random"):
            self.skipTest("Homepage is configured to use another signature")
        name = config.get("name") or "AnfinsenYu"
        period = config.get("period") or 19
        roman = ("I", "II", "III", "IV", "V", "VI")[(period - 1) % 6]
        theme_name = THEMES["cyan-crystal"] if variant == "video-random" else THEMES[variant]
        expected_label = f"{name}，{theme_name}，{roman}，{(period - 1) // 6} 枚金色标记"
        for width in (1280, 390):
            with self.subTest(width=width):
                page = self.browser.new_page(viewport={"width": width, "height": 900},
                                             reduced_motion="no-preference")
                try:
                    page.add_init_script("Math.random = () => 0")
                    page.goto(self.base, wait_until="domcontentloaded")
                    frame = page.frame_locator('iframe[title*="竞逐特签"]')
                    canvas = frame.locator('canvas[role="img"]')
                    canvas.wait_for(state="visible", timeout=10000)
                    page.wait_for_timeout(1500)
                    self.assertEqual(canvas.get_attribute("aria-label"), expected_label)
                    self.assertTrue(canvas.evaluate("el => [...el.getContext('2d').getImageData(0, 0, el.width, el.height).data].some((v, i) => i % 4 === 3 && v > 0)"))
                    first = canvas.evaluate("el => el.toDataURL()")
                    page.wait_for_timeout(800)
                    self.assertNotEqual(first, canvas.evaluate("el => el.toDataURL()"))
                    rect = canvas.bounding_box()
                    iframe = page.locator('iframe[title*="竞逐特签"]').bounding_box()
                    self.assertLessEqual(rect["y"] + rect["height"], iframe["y"] + iframe["height"] + 1)
                finally:
                    page.close()

    def test_embed_uses_name_and_period_from_url(self):
        page = self.browser.new_page()
        try:
            page.goto(self.base + "drive-signature/video-embed.html?name=TESTNAME&period=13")
            canvas = page.locator('canvas[role="img"]')
            canvas.wait_for(state="visible", timeout=10000)
            page.wait_for_timeout(1000)
            self.assertEqual(canvas.get_attribute("aria-label"),
                             "TESTNAME，青色菱晶，I，2 枚金色标记")
        finally:
            page.close()

    def test_random_refresh_changes_signature_and_loads_only_selected_sprite(self):
        page = self.browser.new_page()
        requests = []
        page.on("request", lambda request: requests.append(request.url) if "/sprites-hq/" in request.url else None)
        page.add_init_script("Math.random = () => 0")
        try:
            page.goto(self.base + "drive-signature/video-embed.html?name=TESTNAME&period=13&variant=video-random")
            canvas = page.locator('canvas[role="img"]')
            page.wait_for_timeout(1500)
            first = canvas.get_attribute("aria-label")
            self.assertEqual(first, "TESTNAME，青色菱晶，I，2 枚金色标记")
            self.assertEqual(len(requests), 1)
            page.reload()
            page.wait_for_timeout(1500)
            second = canvas.get_attribute("aria-label")
            self.assertEqual(second, "TESTNAME，紫色能量环，I，2 枚金色标记")
            self.assertEqual(len(requests), 2)
        finally:
            page.close()

    def test_video_embed_can_select_a_different_signature(self):
        page = self.browser.new_page()
        try:
            page.goto(self.base + "drive-signature/video-embed.html?name=TESTNAME&period=13&variant=cyan-pink-wings")
            canvas = page.locator('canvas[role="img"]')
            page.wait_for_timeout(1000)
            self.assertEqual(canvas.get_attribute("aria-label"),
                             "TESTNAME，青粉双翼，I，2 枚金色标记")
        finally:
            page.close()

    def test_all_video_styles_load_and_render_on_mobile(self):
        page = self.browser.new_page(viewport={"width": 390, "height": 844})
        try:
            for variant, name in THEMES.items():
                with self.subTest(variant=variant):
                    page.goto(self.base + f"drive-signature/video-embed.html?name=TESTNAME&period=55&variant={variant}")
                    canvas = page.locator('canvas[role="img"]')
                    page.wait_for_function("""() => {
                        const c = document.querySelector('canvas');
                        const pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
                        for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) return true;
                        return false;
                    }""", timeout=10000)
                    self.assertEqual(canvas.get_attribute("aria-label"),
                                     f"TESTNAME，{name}，I，9 枚金色标记")
                    self.assertFalse(page.locator("#error").is_visible())
                    self.assertLessEqual(canvas.bounding_box()["width"], 390)
        finally:
            page.close()

    def test_missing_sprite_shows_error_without_blank_canvas(self):
        page = self.browser.new_page()
        try:
            page.route("**/sprites-hq/cyan-crystal.png", lambda route: route.abort())
            page.goto(self.base + "drive-signature/video-embed.html?name=TESTNAME&period=13")
            page.locator("#error").wait_for(state="visible", timeout=10000)
            self.assertFalse(page.locator('canvas[role="img"]').is_visible())
        finally:
            page.close()


if __name__ == "__main__":
    unittest.main()
