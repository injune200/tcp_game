import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { gameSessionIds } from '../../session/sessions.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const gameId = gameSessionIds[0]
    console.log(x, y)
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = gameSession.getUser(userId);
    console.log(gameSession)
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    user.updatePosition(x, y);
    const packet = gameSession.getAllLocation();

    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};

export default updateLocationHandler;
