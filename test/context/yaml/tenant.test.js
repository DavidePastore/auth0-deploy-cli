import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';

import Context from '../../../src/context/yaml';
import handler from '../../../src/context/yaml/handlers/tenant';
import { cleanThenMkdir, testDataDir, mockMgmtClient } from '../../utils';


describe('#YAML context tenant settings', () => {
  it('should process tenant settings', async () => {
    const dir = path.join(testDataDir, 'yaml', 'tenant');
    cleanThenMkdir(dir);

    const yaml = `
    tenant:
      friendly_name: 'Auth0 ##ENV##'
    `;
    const yamlFile = path.join(dir, 'config.yaml');
    fs.writeFileSync(yamlFile, yaml);

    const target = {
      friendly_name: 'Auth0 test'
    };


    const config = { AUTH0_INPUT_FILE: yamlFile, AUTH0_KEYWORD_REPLACE_MAPPINGS: { ENV: 'test' } };
    const context = new Context(config, mockMgmtClient());
    await context.load();

    expect(context.assets.tenant).to.deep.equal(target);
  });

  it('should dump tenant', async () => {
    const context = new Context({ AUTH0_INPUT_FILE: './test.yml' }, mockMgmtClient());
    const tenant = {
      friendly_name: 'Auth0 test'
    };
    context.assets.tenant = tenant;

    const dumped = await handler.dump(context);
    expect(dumped).to.deep.equal({ tenant });
  });
});
