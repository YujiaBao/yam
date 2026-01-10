import { net } from 'electron';
import { pathToFileURL } from 'url';

export const handleYamLocalProtocol = (request: Request) => {
  const url = request.url.replace('yam-local://', '');
  try {
    const decodedPath = decodeURIComponent(url);
    return net.fetch(pathToFileURL(decodedPath).toString());
  } catch (error) {
    console.error('Failed to handle yam-local protocol:', error);
    return new Response('Not Found', { status: 404 });
  }
};
