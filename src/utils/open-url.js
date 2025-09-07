import { execa } from 'execa';
import { platform } from 'os';

/**
 * Open URL in default browser
 */
export async function openUrl(url) {
  try {
    const osType = platform();
    
    switch (osType) {
      case 'darwin': // macOS
        await execa('open', [url]);
        break;
      case 'win32': // Windows
        await execa('cmd', ['/c', 'start', url]);
        break;
      default: // Linux and others
        await execa('xdg-open', [url]);
        break;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to open URL:', error.message);
    console.log('Please open manually:', url);
    return false;
  }
}

export default { openUrl };
