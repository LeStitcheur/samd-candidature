import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Aucun jeton requis : Git utilise le gestionnaire d'identifiants du poste.
const cwd = fileURLToPath(new URL('../', import.meta.url));
function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr?.trim() || `${command} a échoué. Le déploiement est arrêté.`);
  return result.stdout?.trim();
}
try {
  const branch = run('git', ['branch', '--show-current'], true);
  if (branch !== 'main') throw new Error('Placez-vous sur la branche main pour publier en production.');
  const remote = run('git', ['remote', 'get-url', 'origin'], true);
  if (!/^(https:\/\/github\.com\/LeStitcheur\/samd-candidature(?:\.git)?|git@github\.com:LeStitcheur\/samd-candidature(?:\.git)?)$/.test(remote)) throw new Error('Le dépôt origin doit être LeStitcheur/samd-candidature.');
  if (run('git', ['diff', '--name-only', '--diff-filter=U'], true)) throw new Error('Résolvez les conflits Git avant de publier.');
  console.log('\nVérification du build…');
  run(process.execPath, ['node_modules/vite/bin/vite.js', 'build']);
  run('git', ['add', '--all']);
  if (run('git', ['diff', '--cached', '--name-only'], true)) {
    const message = process.argv.slice(2).join(' ') || `Publication SAMD — ${new Date().toISOString()}`;
    run('git', ['commit', '-m', message]);
  }
  console.log('\nEnvoi sur GitHub…');
  run('git', ['push', '--set-upstream', 'origin', 'main']);
  console.log('\nEnvoi terminé. Si le dépôt est connecté à Vercel, tout nouveau commit déclenche la publication.');
  console.log('Consultez le tableau de bord Vercel pour confirmer la mise en ligne. Sans nouveau commit, aucun nouveau build n’est déclenché.');
} catch (error) {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
}
