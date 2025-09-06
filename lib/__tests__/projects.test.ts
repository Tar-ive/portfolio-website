import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { projectService } from '../projects';
import { validateProjectStructure } from '../projects';

// Mock fs/promises
jest.mock('fs/promises');

describe('Project Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFileBasedProjects', () => {
    it('should return empty array when no project files exist', async () => {
      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue([]);

      const projects = await projectService.getFileBasedProjects();
      expect(projects).toEqual([]);
    });

    it('should filter only markdown files', async () => {
      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue([
        'project1.md',
        'project2.mdx',
        'readme.txt',
        'image.jpg',
        'project3.md'
      ]);
      
      // Mock file reading to return empty content for now
      fs.readFile.mockResolvedValue('---\ntitle: Test\ndate: 2024-01-01\nstatus: completed\ntags: []\n---\n# Test');

      const projects = await projectService.getFileBasedProjects();
      
      // Should attempt to read only .md and .mdx files
      expect(fs.readFile).toHaveBeenCalledTimes(3);
    });
  });

  describe('validateProjectStructure', () => {
    it('should identify missing directories', async () => {
      const fs = require('fs/promises');
      fs.access.mockRejectedValue(new Error('Directory not found'));

      const result = await validateProjectStructure();
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Projects directory does not exist: content/projects');
    });

    it('should validate successfully with proper structure', async () => {
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readdir.mockResolvedValue(['test-project.md']);
      fs.readFile.mockResolvedValue('---\ntitle: Test\ndate: 2024-01-01\nstatus: completed\ntags: []\n---\n# Test');

      const result = await validateProjectStructure();
      
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('project priority calculation', () => {
    it('should prioritize pinned projects', async () => {
      // This would test the priority calculation logic
      // Implementation would depend on having test data
    });

    it('should prioritize currently-building projects', async () => {
      // This would test status-based priority
    });
  });

  describe('asset path resolution', () => {
    it('should resolve relative asset paths correctly', async () => {
      // This would test the asset path resolution logic
    });
  });
});

describe('Project File Parsing', () => {
  it('should extract frontmatter correctly', () => {
    // Test frontmatter extraction
  });

  it('should validate MDX syntax', () => {
    // Test MDX validation
  });

  it('should handle malformed frontmatter gracefully', () => {
    // Test error handling
  });
});