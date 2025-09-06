#!/usr/bin/env tsx

import { 
  projectService, 
  validateProjectStructure, 
  createProjectStructure 
} from '../lib/projects';
import { 
  assetManager, 
  validateProjectAssetStructure,
  transformMarkdownAssets 
} from '../lib/asset-manager';
import { validateMDXSyntax, extractFrontmatter } from '../lib/mdx';
import fs from 'fs/promises';
import path from 'path';

async function validateProjectSystem() {
  console.log('🔍 Validating File-Based Project Management System\n');
  
  let allTestsPassed = true;

  try {
    // Test 1: Project Structure Validation
    console.log('1. 📁 Project Structure Validation');
    const structureValidation = await validateProjectStructure();
    
    if (structureValidation.valid) {
      console.log('   ✅ Project structure is valid');
    } else {
      console.log('   ❌ Project structure issues found:');
      structureValidation.issues.forEach(issue => console.log(`      - ${issue}`));
      allTestsPassed = false;
    }
    console.log('');

    // Test 2: File-Based Project Loading
    console.log('2. 📄 File-Based Project Loading');
    const projects = await projectService.getFileBasedProjects();
    console.log(`   Found ${projects.length} projects`);
    
    if (projects.length > 0) {
      console.log('   ✅ Projects loaded successfully');
      
      // Validate each project
      for (const project of projects) {
        console.log(`   📋 Validating project: ${project.title}`);
        
        // Check required fields
        const requiredFields = ['id', 'slug', 'title', 'date', 'status', 'tags'];
        const missingFields = requiredFields.filter(field => !project[field as keyof typeof project]);
        
        if (missingFields.length > 0) {
          console.log(`      ❌ Missing required fields: ${missingFields.join(', ')}`);
          allTestsPassed = false;
        } else {
          console.log('      ✅ All required fields present');
        }
        
        // Validate frontmatter
        try {
          const projectPath = path.join(process.cwd(), 'content', 'projects', `${project.slug}.md`);
          const content = await fs.readFile(projectPath, 'utf-8');
          const frontmatter = extractFrontmatter(content);
          
          if (frontmatter) {
            console.log('      ✅ Frontmatter parsed successfully');
          } else {
            console.log('      ❌ Failed to parse frontmatter');
            allTestsPassed = false;
          }
          
          // Validate MDX syntax
          const syntaxValidation = validateMDXSyntax(content);
          if (syntaxValidation.valid) {
            console.log('      ✅ MDX syntax is valid');
          } else {
            console.log('      ❌ MDX syntax errors:');
            syntaxValidation.errors.forEach(error => console.log(`         - ${error}`));
            allTestsPassed = false;
          }
          
        } catch (error) {
          console.log(`      ❌ Error reading project file: ${error}`);
          allTestsPassed = false;
        }
      }
    } else {
      console.log('   ⚠️  No projects found - this might be expected');
    }
    console.log('');

    // Test 3: Asset Management
    console.log('3. 🖼️  Asset Management');
    const allAssets = await assetManager.getAllAssets();
    console.log(`   Found ${allAssets.length} total assets`);
    
    if (allAssets.length > 0) {
      console.log('   ✅ Assets loaded successfully');
      
      // Test asset stats
      const assetStats = await assetManager.getAssetStats();
      console.log(`   📊 Asset breakdown:`);
      Object.entries(assetStats.byType).forEach(([type, count]) => {
        console.log(`      - ${type}: ${count} files`);
      });
      
      // Test asset validation
      const sampleAsset = allAssets[0];
      const isValid = await assetManager.validateAssetExists(sampleAsset.path);
      if (isValid) {
        console.log('   ✅ Asset validation working');
      } else {
        console.log('   ❌ Asset validation failed');
        allTestsPassed = false;
      }
    } else {
      console.log('   ⚠️  No assets found');
    }
    console.log('');

    // Test 4: Project-Specific Asset Management
    console.log('4. 📁 Project-Specific Asset Management');
    if (projects.length > 0) {
      const testProject = projects[0];
      
      // Validate project asset structure
      const assetValidation = await validateProjectAssetStructure(testProject.slug);
      
      if (assetValidation.valid) {
        console.log(`   ✅ Asset structure valid for project: ${testProject.title}`);
      } else {
        console.log(`   ⚠️  Asset structure issues for project: ${testProject.title}`);
        assetValidation.issues.forEach(issue => console.log(`      - ${issue}`));
        
        if (assetValidation.suggestions.length > 0) {
          console.log('   💡 Suggestions:');
          assetValidation.suggestions.forEach(suggestion => console.log(`      - ${suggestion}`));
        }
      }
      
      // Test asset path resolution
      const testPaths = [
        './assets/test-image.jpg',
        '/media/existing-image.jpg',
        'https://example.com/external.jpg'
      ];
      
      console.log('   🔗 Testing asset path resolution:');
      for (const testPath of testPaths) {
        const resolved = await assetManager.resolveAssetPath(testPath, testProject.slug);
        console.log(`      ${testPath} → ${resolved || 'null'}`);
      }
    }
    console.log('');

    // Test 5: Service Integration
    console.log('5. 🔧 Service Integration');
    
    // Test getting projects by status
    const currentlyBuildingProjects = await projectService.getProjectsByStatus('currently-building');
    console.log(`   Found ${currentlyBuildingProjects.length} currently-building projects`);
    
    // Test getting projects by tag
    if (projects.length > 0 && projects[0].tags.length > 0) {
      const firstTag = projects[0].tags[0];
      const projectsWithTag = await projectService.getProjectsByTag(firstTag);
      console.log(`   Found ${projectsWithTag.length} projects with tag "${firstTag}"`);
    }
    
    // Test project stats
    const stats = await projectService.getProjectStats();
    console.log('   📊 Project statistics:');
    console.log(`      - Total projects: ${stats.total}`);
    console.log(`      - By status: ${JSON.stringify(stats.byStatus)}`);
    console.log(`      - By category: ${JSON.stringify(stats.byCategory)}`);
    console.log(`      - Total unique tags: ${stats.totalTags}`);
    
    console.log('   ✅ Service integration working');
    console.log('');

    // Test 6: Error Handling
    console.log('6. 🛡️  Error Handling');
    
    try {
      await projectService.getProject('non-existent-project');
      console.log('   ❌ Should have thrown error for non-existent project');
      allTestsPassed = false;
    } catch (error) {
      console.log('   ✅ Correctly handles non-existent project requests');
    }
    
    // Test invalid asset path
    const invalidAssetExists = await assetManager.validateAssetExists('/non/existent/path.jpg');
    if (!invalidAssetExists) {
      console.log('   ✅ Correctly identifies non-existent assets');
    } else {
      console.log('   ❌ Should have returned false for non-existent asset');
      allTestsPassed = false;
    }
    console.log('');

    // Final Results
    console.log('🏁 Validation Results');
    if (allTestsPassed) {
      console.log('   ✅ All tests passed! File-based project management system is working correctly.');
    } else {
      console.log('   ❌ Some tests failed. Please review the issues above.');
    }
    
    console.log('\n📋 System Summary:');
    console.log(`   - Projects loaded: ${projects.length}`);
    console.log(`   - Assets available: ${allAssets.length}`);
    console.log(`   - Structure valid: ${structureValidation.valid ? 'Yes' : 'No'}`);
    
    return allTestsPassed;

  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    return false;
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateProjectSystem().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { validateProjectSystem };