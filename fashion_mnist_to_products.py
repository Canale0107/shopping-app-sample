import os
from tensorflow.keras.datasets import fashion_mnist
from PIL import Image, ImageOps

# カテゴリ名リスト
LABELS = [
    "tshirt",    # 0
    "trouser",   # 1
    "pullover",  # 2
    "dress",     # 3
    "coat",      # 4
    "sandal",    # 5
    "shirt",     # 6
    "sneaker",   # 7
    "bag",       # 8
    "ankleboot"  # 9
]

# 保存先ディレクトリ
SAVE_DIR = "public/images/products"
os.makedirs(SAVE_DIR, exist_ok=True)

# fashion-MNISTデータセットをロード
(x_train, y_train), (_, _) = fashion_mnist.load_data()

# 各カテゴリ3枚ずつ保存
num_per_category = 3
saved_count = {label: 0 for label in range(10)}

for img, label in zip(x_train, y_train):
    if saved_count[label] < num_per_category:
        category = LABELS[label]
        idx = saved_count[label] + 1
        filename = f"{category}_{idx:02d}.png"
        filepath = os.path.join(SAVE_DIR, filename)
        # 画像をPILで白黒反転して保存
        im = Image.fromarray(img)
        im = ImageOps.invert(im)
        im.save(filepath)
        saved_count[label] += 1
    if all(count >= num_per_category for count in saved_count.values()):
        break

print(f"Saved {num_per_category} images for each category in {SAVE_DIR} (inverted)") 