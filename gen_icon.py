# -*- coding: utf-8 -*-
"""纯标准库生成 PWA 图标：夜空 + 月亮笑脸 + 星星 + 云 + 房子 + 树
用法: python gen_icon.py [size] [output.png]
"""
import sys, math, struct, zlib

SIZE = int(sys.argv[1]) if len(sys.argv) > 1 else 512
OUT = sys.argv[2] if len(sys.argv) > 2 else ('icon-%d.png' % SIZE)
K = SIZE / 512.0  # 坐标缩放

def px(x):  return int(round(x * K))
def lerp(a, b, t): return int(a + (b - a) * t)

# ---- 背景渐变（深蓝紫夜空 -> 暖紫） ----
TOP = (46, 51, 84)      # #2E3354
BOT = (78, 53, 99)      # #4E3563
GROUND = (36, 26, 20)   # 底部暖暗色 #241A14

pix = bytearray(SIZE * SIZE * 4)
for y in range(SIZE):
    t = y / float(SIZE - 1)
    r = lerp(TOP[0], BOT[0], t); g = lerp(TOP[1], BOT[1], t); b = lerp(TOP[2], BOT[2], t)
    base = y * SIZE * 4
    for x in range(SIZE):
        i = base + x * 4
        pix[i] = r; pix[i+1] = g; pix[i+2] = b; pix[i+3] = 255

def blend(x, y, cr, cg, cb, alpha):
    """alpha 0-255 覆盖式混合"""
    if x < 0 or y < 0 or x >= SIZE or y >= SIZE: return
    i = (y * SIZE + x) * 4
    a = alpha / 255.0
    pix[i]   = int(pix[i]   * (1 - a) + cr * a)
    pix[i+1] = int(pix[i+1] * (1 - a) + cg * a)
    pix[i+2] = int(pix[i+2] * (1 - a) + cb * a)
    # alpha 保持 255

def fill_ellipse(cx, cy, a, b, cr, cg, cb, alpha=255):
    x0, x1 = max(0, px(cx - a)), min(SIZE, px(cx + a) + 1)
    y0, y1 = max(0, px(cy - b)), min(SIZE, px(cy + b) + 1)
    for yy in range(y0, y1):
        for xx in range(x0, x1):
            nx = (xx / K - cx) / a; ny = (yy / K - cy) / b
            d = math.sqrt(nx * nx + ny * ny)
            if d <= 1.0:
                blend(xx, yy, cr, cg, cb, alpha)

def fill_circle(cx, cy, r, cr, cg, cb, alpha=255):
    x0, x1 = max(0, px(cx - r)), min(SIZE, px(cx + r) + 1)
    y0, y1 = max(0, px(cy - r)), min(SIZE, px(cy + r) + 1)
    for yy in range(y0, y1):
        for xx in range(x0, x1):
            dx = xx / K - cx; dy = yy / K - cy
            if dx * dx + dy * dy <= r * r:
                blend(xx, yy, cr, cg, cb, alpha)

def fill_star(cx, cy, r, cr, cg, cb, alpha=255):
    """四角星：菱形 (|dx|+|dy|)/r <= 1，略圆化"""
    x0, x1 = max(0, px(cx - r)), min(SIZE, px(cx + r) + 1)
    y0, y1 = max(0, px(cy - r)), min(SIZE, px(cy + r) + 1)
    rr = r * 0.98
    for yy in range(y0, y1):
        for xx in range(x0, x1):
            dx = abs(xx / K - cx); dy = abs(yy / K - cy)
            if dx + dy <= rr:
                blend(xx, yy, cr, cg, cb, alpha)

def edge(p0, p1, p2):
    return (p1[0]-p0[0])*(p2[1]-p0[1]) - (p1[1]-p0[1])*(p2[0]-p0[0])

def fill_tri(tri, cr, cg, cb, alpha=255):
    x0 = px(min(p[0] for p in tri)); x1 = px(max(p[0] for p in tri)) + 1
    y0 = px(min(p[1] for p in tri)); y1 = px(max(p[1] for p in tri)) + 1
    for yy in range(max(0, y0), min(SIZE, y1)):
        for xx in range(max(0, x0), min(SIZE, x1)):
            pt = (xx / K, yy / K)
            d1 = edge(tri[0], tri[1], pt); d2 = edge(tri[1], tri[2], pt); d3 = edge(tri[2], tri[0], pt)
            if (d1 >= 0 and d2 >= 0 and d3 >= 0) or (d1 <= 0 and d2 <= 0 and d3 <= 0):
                blend(xx, yy, cr, cg, cb, alpha)

def fill_rect(x0, y0, x1, y1, cr, cg, cb, alpha=255):
    for yy in range(max(0, px(y0)), min(SIZE, px(y1) + 1)):
        for xx in range(max(0, px(x0)), min(SIZE, px(x1) + 1)):
            blend(xx, yy, cr, cg, cb, alpha)

# ---- 底部暖色山丘 ----
fill_ellipse(256, 520, 300, 110, *GROUND, 215)

# ---- 云朵（半透明） ----
CLOUD = (255, 248, 235)
fill_ellipse(150, 300, 92, 30, *CLOUD, 70)
fill_ellipse(118, 296, 46, 24, *CLOUD, 80)
fill_ellipse(188, 296, 40, 22, *CLOUD, 80)
fill_ellipse(330, 262, 76, 26, *CLOUD, 60)
fill_ellipse(300, 258, 36, 20, *CLOUD, 70)
fill_ellipse(362, 258, 32, 18, *CLOUD, 70)

# ---- 月亮笑脸 ----
MOON = (255, 217, 142); MOON2 = (255, 201, 107)
fill_circle(330, 168, 100, *MOON)
fill_circle(352, 150, 62, *MOON2)   # 渐变亮部
EYE = (122, 84, 46)
fill_circle(296, 146, 10, *EYE)
fill_circle(364, 146, 10, *EYE)
# 微笑弧线：下半圆弧，嘴角向下弯
for yy in range(px(120), px(230)):
    for xx in range(px(260), px(400)):
        dx = xx / K - 330; dy = yy / K - 150
        d = math.sqrt(dx * dx + dy * dy)
        if abs(d - 46) <= 7 and dy > 0 and abs(dx) <= 42:
            blend(xx, yy, *EYE, 255)

# ---- 星星 ----
STAR = (255, 243, 214)
fill_star(120, 130, 16, *STAR)
fill_star(205, 84, 11, *STAR)
fill_star(428, 100, 18, *STAR)
fill_star(472, 232, 12, *STAR)
fill_star(86, 252, 9, *STAR)
fill_star(96, 430, 11, *STAR)
fill_star(452, 372, 10, *STAR)
fill_star(398, 46, 8, *STAR)

# ---- 小树（左侧） ----
fill_rect(108, 398, 134, 452, 138, 90, 60)          # 树干
fill_circle(121, 378, 40, 127, 168, 120)            # 树冠
fill_circle(100, 390, 26, 144, 182, 136)
fill_circle(142, 392, 24, 144, 182, 136)

# ---- 小房子（中央偏右，暖灯窗） ----
WALL = (255, 240, 216); ROOF = (232, 145, 95); WIN = (255, 217, 142); DOOR = (180, 101, 63)
fill_rect(203, 330, 333, 428, *WALL)                # 墙
fill_tri([(196, 332), (340, 332), (268, 280)], *ROOF)  # 屋顶
fill_rect(310, 280, 336, 316, 140, 78, 48)          # 烟囱
fill_rect(212, 352, 250, 392, *WIN)                 # 左窗亮灯
fill_rect(286, 352, 324, 392, *WIN)                 # 右窗亮灯
fill_rect(248, 378, 288, 428, *DOOR)                # 门

# ---- 编码 PNG ----
def chunk(tag, data):
    c = struct.pack('>I', len(data)) + tag + data
    c += struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    return c

raw = bytearray()
for y in range(SIZE):
    raw.append(0)  # filter: None
    raw.extend(pix[y * SIZE * 4:(y + 1) * SIZE * 4])

ihdr = struct.pack('>IIBBBBB', SIZE, SIZE, 8, 6, 0, 0, 0)
png = (b'\x89PNG\r\n\x1a\n'
       + chunk(b'IHDR', ihdr)
       + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
       + chunk(b'IEND', b''))
open(OUT, 'wb').write(png)
print('OK', OUT, SIZE, 'x', SIZE, len(png), 'bytes')
