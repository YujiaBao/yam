import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeatureCarousel, FeatureSlide } from '../src/components/FeatureCarousel';
import React from 'react';

describe('FeatureCarousel', () => {
  const mockSlides: FeatureSlide[] = [
    { id: '1', title: 'Slide 1', description: 'Desc 1', content: <div>Content 1</div> },
    { id: '2', title: 'Slide 2', description: 'Desc 2', content: <div>Content 2</div> },
  ];

  it('renders the first slide initially', () => {
    render(<FeatureCarousel slides={mockSlides} />);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('cycles to the next slide on click', () => {
    render(<FeatureCarousel slides={mockSlides} />);
    const nextBtn = screen.getAllByLabelText('Next feature')[0];
    fireEvent.click(nextBtn);
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('cycles to the previous slide on click', () => {
    render(<FeatureCarousel slides={mockSlides} />);
    const prevBtn = screen.getAllByLabelText('Previous feature')[0];
    fireEvent.click(prevBtn);
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('navigates via indicators', () => {
    render(<FeatureCarousel slides={mockSlides} />);
    const indicator = screen.getByLabelText('Go to slide 2');
    fireEvent.click(indicator);
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });
});