// 서버 초기화 작업
import { v4 as uuidv4 } from 'uuid';
import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';
import { addGameSession, addGameSessionId } from '../session/game.session.js';

const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    await testAllConnections(pools);
    const gameId = uuidv4();
    addGameSession(gameId);
    addGameSessionId(gameId)
    // 다음 작업
  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
