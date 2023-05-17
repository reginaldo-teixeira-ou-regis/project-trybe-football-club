import * as express from 'express';
import teamRouter from './routers/TeamRouter';
import loginRouter from './routers/LoginRouter';
import matchRouter from './routers/MatchRouter';
import leaderboardRouter from './routers/LeaderboardRouter';

class App {
  public app: express.Express;

  constructor(
    private team = teamRouter,
    private login = loginRouter,
    private match = matchRouter,
    private board = leaderboardRouter,
  ) {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
    this.app.use('/teams', this.team);
    this.app.use('/login', this.login);
    this.app.use('/matches', this.match);
    this.app.use('/leaderboard', this.board);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
