import pytesseract
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

# Load the image
image_path = "cap.png"
image = Image.open(image_path)

# Preprocess the image
def preprocess_image(image):
    # Convert to grayscale
    gray_image = ImageOps.grayscale(image)
    
    # Enhance the image contrast
    enhancer = ImageEnhance.Contrast(gray_image)
    enhanced_image = enhancer.enhance(3)
    
    # Apply a median filter to reduce noise
    filtered_image = enhanced_image.filter(ImageFilter.MedianFilter(size=5))
    
    # Binarize the image
    threshold = 128
    binary_image = filtered_image.point(lambda p: p > threshold and 255)
    
    return binary_image

# Preprocess the image
processed_image = preprocess_image(image)

# Save the processed image
processed_image_path = "processed_image.png"
processed_image.save(processed_image_path)
print(f"Processed image saved at: {processed_image_path}")

# Use pytesseract to do OCR on the processed image
captcha_text = pytesseract.image_to_string(processed_image, config='--psm 6').strip()

print(f"Captcha: {captcha_text}")
