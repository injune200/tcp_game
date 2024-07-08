import { addUser, getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';
import { addGameSession, getGameSession, removeGameSession } from '../../session/game.session.js';
import { gameSessionIds } from '../../session/sessions.js';
import Game from '../../classes/models/game.class.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId } = payload;


    let user = await findUserByDeviceID(deviceId);
    console.log(user)

    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    addUser(userId, socket);


    const gameId = gameSessionIds[0]

    const gameSession = getGameSession(gameId);

    const existUser = gameSession.getUser(user.id);
    if (!existUser) {
      gameSession.addUser(user);
    }


    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
