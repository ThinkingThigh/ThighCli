#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const shell = require("shelljs");
const initAction = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "请输入项目名称:",
        name: "name",
        validate: (val) => {
          return val ? true : "请输入项目名称";
        },
      },
      {
        type: "list",
        message: "请选择项目类型:",
        name: "type",
        choices: ["fe-h5-template", "fe-pc-template"],
      },
    ])
    .then((answer) => {
      console.log(`项目 ${answer.name} 生成中... 请稍后..."`);
      const remote = `git@github.com:ThinkingThigh/${answer.type}.git`;
      const curName = answer.type;
      const tarName = answer.name;
      if (!shell.exec(`git clone ${remote} --depth=1`).code) {
        shell.mv(curName, tarName);
        shell.rm("-rf", `./${tarName}/.git`);
        shell.cd(tarName);
        if (!shell.exec("npm i").code) {
          console.log("项目生成成功！");
        } else {
          console.log("npm安装失败！");
        }
      } else {
        console.log("模板项目拉取失败！");
      }
    });
};

program.version(require(`./package.json`).version);
program.command("init").description("生成项目").action(initAction);
program.parse(process.argv);
