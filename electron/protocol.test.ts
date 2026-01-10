import { describe, it, expect, vi } from 'vitest';
import { handleYamLocalProtocol } from './protocol';
import { net } from 'electron';
import { pathToFileURL } from 'url';

vi.mock('electron', () => ({
  net: {
    fetch: vi.fn(),
  },
}));

describe('yam-local protocol handler', () => {
  it('should fetch the correct file URL for valid requests', () => {
    const request = { url: 'yam-local:///path/to/image.png' } as Request;
    handleYamLocalProtocol(request);
    
    // We expect it to resolve to a file url. 
    // Since we are not mocking pathToFileURL, it will produce a real file:// URL based on CWD or root.
    // We just want to check that net.fetch is called.
    expect(net.fetch).toHaveBeenCalled();
    const calledUrl = (net.fetch as any).mock.calls[0][0];
    expect(calledUrl).toContain('file://');
    expect(calledUrl).toContain('image.png');
  });

  it('should decode URI components', () => {
    const request = { url: 'yam-local:///path/to/my%20image.png' } as Request;
    handleYamLocalProtocol(request);
    
    const calledUrl = (net.fetch as any).mock.calls[1][0]; // 2nd call
    expect(calledUrl).toContain('my%20image.png'); // pathToFileURL encodes spaces again usually
  });

  it('should return 404 on error', () => {
    // Trigger an error in decodeURIComponent by providing an invalid sequence
    const request = { url: 'yam-local://%E0%A4%A' } as Request;
    
    const response = handleYamLocalProtocol(request);
    
    expect(response).toBeInstanceOf(Response);
    if (response instanceof Response) {
      expect(response.status).toBe(404);
    }
  });
});