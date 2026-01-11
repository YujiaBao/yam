import { useState, useEffect } from 'react';
import type { ViewMode } from '../types';

export const useGeneralSettings = () => {
  const [launchViewMode, setLaunchViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('yam_launch_view_mode') as ViewMode) || 'split';
  });

  const [fileOpenViewMode, setFileOpenViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('yam_file_open_view_mode') as ViewMode) || 'preview';
  });

  const [customDefaultContent, setCustomDefaultContent] = useState<string | null>(() => {
    return localStorage.getItem('yam_custom_default_content');
  });

  useEffect(() => {
    localStorage.setItem('yam_launch_view_mode', launchViewMode);
  }, [launchViewMode]);

  useEffect(() => {
    localStorage.setItem('yam_file_open_view_mode', fileOpenViewMode);
  }, [fileOpenViewMode]);

  useEffect(() => {
    if (customDefaultContent !== null) {
      localStorage.setItem('yam_custom_default_content', customDefaultContent);
    } else {
        localStorage.removeItem('yam_custom_default_content');
    }
  }, [customDefaultContent]);

  return {
    launchViewMode,
    setLaunchViewMode,
    fileOpenViewMode,
    setFileOpenViewMode,
    customDefaultContent,
    setCustomDefaultContent
  };
};
