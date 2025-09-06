import { projectService, validateProjectStructure } from '../lib/projects';
import { assetManager } from '../lib/asset-manager';

async function testProjectService() {
  console.log('🧪 Testing Project Service Implementation...\n');

  try {
    // Test 1: Validate project structure
    console.log('1. Validating project structure...');
    const structureValidation = await validateProjectStructure();
    console.log('   Structure valid:', structureValidation.valid);
    if (structureValidation.issues.length > 0) {
      console.log('   Issues:', structureValidation.issues);
    }
    console.log('');

    // Test 2: Load file-based projects
    console.log('2. Loading file-based projects...');
    const projects = await projectService.getFileBasedProjects();
    console.log(`   Found ${projects.length} projects`);
    
    if (projects.length > 0) {
      const firstProject = projects[0];
      console.log('   First project details:');
      console.log(`     - Slug: ${firstProject.slug}`);
      console.log(`     - Title: ${firstProject.title}`);
      console.log(`     - Status: ${firstProject.status}`);
      console.log(`     - Tags: ${firstProject.tags.join(', ')}`);
      console.log(`     - Priority: ${firstProject.priority}`);
      console.log(`     - Reading time: ${firstProject.readingTime} min`);
      console.log(`     - Word count: ${firstProject.wordCount}`);
    }
    console.log('');

    // Test 3: Get project statistics
    console.log('3. Getting project statistics...');
    const stats = await projectService.getProjectStats();
    console.log('   Stats:', JSON.stringify(stats, null, 2));
    console.log('');

    // Test 4: Test asset management
    console.log('4. Testing asset management...');
    const allAssets = await assetManager.getAllAssets();
    console.log(`   Found ${allAssets.length} total assets`);
    
    if (allAssets.length > 0) {
      const assetStats = await assetManager.getAssetStats();
      console.log('   Asset stats:', JSON.stringify(assetStats, null, 2));
    }
    console.log('');

    // Test 5: Test individual project loading
    if (projects.length > 0) {
      console.log('5. Testing individual project loading...');
      const projectSlug = projects[0].slug;
      const singleProject = await projectService.getProject(projectSlug);
      console.log(`   Successfully loaded project: ${singleProject.title}`);
      
      // Test project assets
      const projectAssets = await assetManager.getProjectAssets(projectSlug);
      console.log(`   Project has ${projectAssets.length} assets`);
    }

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the test
testProjectService();