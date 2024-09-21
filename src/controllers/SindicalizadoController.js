const Sindicalizado = require("../models/Sindicalizado.js");
const Dependente = require("../models/Dependente.js");
const Convidado = require("../models/Convidado.js");
const nodemailer = require("nodemailer");
const moment = require("moment");
const sequelize = require("sequelize");

module.exports = class SindicalizadoController {
  static home(req, res) {
    res.render("home");
  }
  static async form(req, res) {
    let disabled;
    let presenca;
    let vai;
    const user = await Sindicalizado.findOne({
      where: { id: req.session.userId },
      raw: true,
    });
    if (user) {
      user.nascimento = moment(user.nascimento).format("DD/MM/YYYY");
      const dependentes = await Dependente.findAll({
        where: { responsavel: req.session.userId },
        raw: true,
      });
      const dependentesConfirmados = await Dependente.findAll({
        where: { responsavel: req.session.userId, presenca: 1 },
        raw: true,
      });
      const convidado = await Convidado.findOne({
        where: { responsavel: req.session.userId },
        raw: true,
      });
      if (user.presenca == 1 || user.presenca == 0) {
        disabled = "disabled";
        presenca = true;
      } else {
        presenca = false;
      }

      if (user.presenca == 1) {
        vai = true;
      } else if (user.presenca == 0) {
        vai = false;
      }
      res.render("formulario", {
        sindicalizado: user,
        dependentes: dependentes,
        dependentesConfirmados: dependentesConfirmados,
        convidado: convidado,
        disabled: disabled,
        presenca: presenca,
        vai: vai,
      });
    }
  }

  static async relatorio(req, res) {
    const action = req.body.action;
    if (action == "email") {
      const transporter = nodemailer.createTransport({
        host: "host do email",
        port: "porta do email",
        secure: true,
        auth: {
          user: "usuario do email",
          pass: "senha do email",
        },
      });

      const sindicalizados = await Sindicalizado.findAll({ where: { presenca: null }, raw: true });

      sindicalizados.forEach(async (sindicalizado) => {
        const mailOptions = {
          from: "usuario do email",
          to: sindicalizado.email,
          subject: "Confirmar presença para a festa do sindicato",
          text: "Você ainda não confirmou sua presença para a festa do sindicato.",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("Erro:", error);
          } else {
            console.log("Email enviado:", info.response);
          }
        });
      });
      res.redirect("/dashboard");
      return;
    }
    let presenca;
    let contabilizarPresenca = 0;
    if (action === "relatorio1") {
      presenca = 1;
      contabilizarPresenca = 1;
    } else if (action === "relatorio2") {
      presenca = 0;
    } else if (action === "relatorio3") {
      presenca = null;
    }
    const pessoas = await Sindicalizado.findAll({
      include: [{ model: Dependente, where: { presenca: presenca } }, { model: Convidado }],
      where: { presenca: presenca },
      order: [["nome", "ASC"]],
    });

    res.render("relatorio", { pessoas: pessoas, contabilizarPresenca: contabilizarPresenca });
  }

  static async dashboard(req, res) {
    const password = req.body.password;

    if (password === "senha") {
      res.render("dashboard", { access: true });
    } else {
      res.render("dashboard", { access: false });
    }
  }

  static async checkSindicalizado(req, res) {
    const { cpf, matricula, nascimento } = req.body;
    const dataNascimento = nascimento.split("/").reverse().join("-");

    const user = await Sindicalizado.findOne({
      where: { cpf: cpf, matricula: matricula, nascimento: dataNascimento },
      raw: true,
    });

    if (user) {
      const Dependentes = await Dependente.findAll({
        where: { responsavel: user.id },
      });
      req.session.userId = user.id;
      req.session.save(() => {
        res.redirect("/formulario");
      });
    } else {
      res.redirect("/");
    }
  }

  static async confirmSindicalizado(req, res) {
    const { id, dependentes, confirm, convidadoCpf, convidado, convidadoSexo } = req.body;
    if (dependentes && dependentes.length > 0 && confirm === "confirmar") {
      dependentes.forEach(async (dependente) => {
        await Dependente.update({ presenca: 1 }, { where: { id: dependente } });
      });
    }
    if (confirm === "confirmar") {
      await Sindicalizado.update({ presenca: 1 }, { where: { id: id } });

      if (convidado) {
        const convidadoExists = await Convidado.findOne({ where: { cpf: convidadoCpf } });
        if (convidadoExists) {
          res.redirect("/formulario");
          return;
        }
        await Convidado.create({
          nome: convidado,
          cpf: convidadoCpf,
          sexo: convidadoSexo,
          responsavel: req.session.userId,
        });
      }
    } else if (confirm === "recusar") {
      await Sindicalizado.update({ presenca: 0 }, { where: { id: id } });
      await Dependente.update({ presenca: 0 }, { where: { responsavel: id } });
      await Convidado.update({ presenca: 0 }, { where: { responsavel: id } });
    } else if (confirm === "reescolher") {
      await Sindicalizado.update({ presenca: null }, { where: { id: id } });
      await Dependente.update({ presenca: 0 }, { where: { responsavel: id } });
      await Convidado.destroy({ where: { responsavel: id } });
    }
    res.redirect("/formulario");
  }

  static async addConvidado(req, res) {}

  // faz envio do e-mail para os sindicalizados que ainda não confirmaram presença
  static async sendMail(req, res) {
    const transporter = nodemailer.createTransport({
      host: "host do email",
      port: "porta do email",
      secure: true,
      auth: {
        user: "usuario do email",
        pass: "senha do email",
      },
    });

    const sindicalizados = await Sindicalizado.findAll({ where: { presenca: null }, raw: true });

    sindicalizados.forEach(async (sindicalizado) => {
      const mailOptions = {
        from: "usuario do email",
        to: sindicalizado.email,
        subject: "Confirmar presença para a festa do sindicato",
        text: "Você ainda não confirmou sua presença para a festa do sindicato.",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Erro:", error);
        } else {
          console.log("Email enviado:", info.response);
        }
      });
    });
  }
};
