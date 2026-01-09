import { render, screen, fireEvent } from '@testing-library/react';
import { Editor } from './Editor';
import { describe, it, expect, vi } from 'vitest';

describe('Editor', () => {
  it('renders markdown content', () => {
    const markdown = '# Hello';
    render(<Editor markdown={markdown} setMarkdown={vi.fn()} viewMode="edit" />);
    expect(screen.getByDisplayValue(markdown)).toBeInTheDocument();
  });

  it('calls setMarkdown when text changes', () => {
    const setMarkdown = vi.fn();
    render(<Editor markdown="" setMarkdown={setMarkdown} viewMode="edit" />);
    const textarea = screen.getByPlaceholderText(/Start writing.../i);
    fireEvent.change(textarea, { target: { value: 'New content' } });
    expect(setMarkdown).toHaveBeenCalledWith('New content');
  });

  it('is hidden when viewMode is preview', () => {
    const { container } = render(<Editor markdown="" setMarkdown={vi.fn()} viewMode="preview" />);
    expect(container.firstChild).toHaveClass('hidden');
  });
});
