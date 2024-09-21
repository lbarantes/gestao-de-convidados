const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const connection = require("./database/connection");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const moment = require("moment");

/* Models */
const Sindicalizado = require("./models/Sindicalizado");
const Dependente = require("./models/Dependente");
const Convidado = require("./models/Convidado");

/* Importando Rotas */

/* Controllers */
const SindicalizadoController = require("./controllers/SindicalizadoController");
const { checkAuth } = require("./helpers/auth");

/* Helpers */

/* Definindo template engine */
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: {
      ifCond: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
    partialsDir: ["views/partials"],
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

/* Recebendo resposta do body (forms) */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Middleware (funções intermediárias) de session */
const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    name: "session",
    secret: "nesso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: oneDay,
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
    },
  })
);

/* Public */
app.use(express.static(path.join(__dirname, "/public")));

/* Passar a session da requisição e mandar para resposta */
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }
  next();
});

/* Rotas */
app.get("/", async (req, res) => {
  const actualDate = moment();
  const dataLimite = moment("9999-01-01");

  disabled = true;
  if (moment(actualDate).diff(dataLimite, "days") < 0) {
    disabled = false;
  }
  res.render("home", { disabled: disabled });
});

app.get("/formulario", checkAuth, SindicalizadoController.form);
// caminho "secreto" para o responsável pela área de "comunicação" do sindicato poder visualizar relatórios e envio de e-mails
app.get("/dashboard", SindicalizadoController.dashboard);

app.post("/formulario", SindicalizadoController.checkSindicalizado);
app.post("/confirm", SindicalizadoController.confirmSindicalizado);
app.post("/sendmail", SindicalizadoController.sendMail);
app.post("/dashboard", SindicalizadoController.dashboard);
app.post("/dashboard/action", SindicalizadoController.relatorio);

/* Iniciar o servidor quando a conexão com banco de dados for feita */
connection
  .sync()
  .then(() => {
    app.listen(3000, async () => {
      console.log("Servidor iniciado na porta 3000");
    });
  })
  .catch((err) => console.log(err));
