import os
import uuid
import logging
from werkzeug.utils import secure_filename
from datetime import datetime

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    """Check if file is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, upload_folder):
    """Save uploaded file and return path"""
    try:
        if file.filename == '':
            return None
        
        if not allowed_file(file.filename):
            return None
        
        # Create upload folder if doesn't exist
        os.makedirs(upload_folder, exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        filename = secure_filename(f"{timestamp}_{unique_id}_{file.filename}")
        
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        logger.info(f"File saved: {file_path}")
        return file_path
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return None

def delete_file(file_path):
    """Delete file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"File deleted: {file_path}")
            return True
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
    return False

def get_file_size(file_path):
    """Get file size in MB"""
    try:
        size_bytes = os.path.getsize(file_path)
        return size_bytes / (1024 * 1024)
    except Exception as e:
        logger.error(f"Error getting file size: {str(e)}")
        return 0

def cleanup_old_files(folder, max_age_hours=24):
    """Delete files older than max_age_hours"""
    try:
        import glob
        from datetime import datetime, timedelta
        
        threshold = datetime.now() - timedelta(hours=max_age_hours)
        deleted_count = 0
        
        for file_path in glob.glob(os.path.join(folder, '*')):
            if os.path.isfile(file_path):
                file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                if file_time < threshold:
                    os.remove(file_path)
                    deleted_count += 1
        
        logger.info(f"Deleted {deleted_count} old files from {folder}")
        return deleted_count
    except Exception as e:
        logger.error(f"Error cleaning up files: {str(e)}")
        return 0
