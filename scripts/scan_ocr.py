import sys
import json
import warnings
import os

# Suppress warnings
warnings.filterwarnings('ignore')
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided."}))
        sys.exit(1)

    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"File not found: {image_path}"}))
        sys.exit(1)

    try:
        import easyocr
        # Use English and Indonesian
        reader = easyocr.Reader(['en', 'id'], gpu=False)
        result = reader.readtext(image_path)
        
        # Result format: [(bbox, text, prob), ...]
        text_lines = [item[1] for item in result]
        
        print(json.dumps({"success": True, "text": "\n".join(text_lines)}))
    except ImportError:
        print(json.dumps({"error": "easyocr module not installed. Please run: pip install easyocr"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
