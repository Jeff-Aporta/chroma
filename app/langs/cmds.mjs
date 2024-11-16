/*:->{"type": "no-code",
  "name": "Módulo de comandos para agrupar en bloques, anexar notas y decorar",huerotate: 8,
  "content": `
    <p>
      Este módulo de JavaScript está diseñado para mejorar la legibilidad y organización del código mediante 
    <p>
      la agrupación de bloques, la adición de notas y la decoración con comentarios especiales.
    <p align="right"><br/>
    <b>Autor</b>: Jeffrey Agudelo (<a href="https://github.com/Jeff-Aporta" target="_blank">Jeff-Aporta</a>)
   `
}*/ /*<-:*/
/*:->{"type": "note", "name": "Exports del módulo", huerotate: 6,
}*/
export default extractGroups;
export { Resaltados };
/*<-:*/

/*:->{"type": "note", "name": "Funciones principales", 
    "content": `
      <p>Estas funciones son las que se encargan de hacer la agrupación en bloques y la extracción de notas, 
      para mejorar la legibilidad y organización del código.
    `,
}*/
function extractGroups({ input, transform }) {
  /*:->!{"name": "Extracción y generación de bloques"}*/
  /*:->{"type": "note", "name": "No hay entrada para procesar", huerotate: 6}*/
  if (!input) {
    return "";
  }
  /*<-:*/
  /*:->{"type": "note", "name": "Expresiones regulares para bloques", 
    "content": `
    <p>Identifican los comentarios de apertura y cierre que generan las agrupaciones de bloques.
  `}*/
  const open = /\/\*:->!?\{[\s\S]*?\}\*\//;
  const close = ["/\u002A<-:\u002A/", "/\u002A!<-:\u002A/"];
  const regex = new RegExp(
    `(${open.source}|(?<!")${close
      .map((c) => c.replace(/\//g, "\\/").replace(/\*/g, "\\*"))
      .join("|")})(?<!")`,
    "g"
  );
  /*<-:*/
  {
    /*:->{"type": "prev", "name": "Limpieza de la entrada", 
    "content": `
    <p>Limpiar el formato del código.
    <p>Evita el abrazo en bloques de control de flujo, evita que las notas se abracen,
    y en los demás bloques realiza los abrazos correspondientes
    `}*/
    /*:->{"type": "note", "name": "Homogenización de saltos de línea",
      "content": `
      <p>Remplaza los saltos de línea de Windows por los de Unix.
    `}*/
    input = input.replaceAll("\r", "\n").replace(/\n\n/g, "\n");
    /*<-:*/

    /*:->{"type": "note", "name": "Solución de problemas con líneas vacías", "content": "Se agregan un espacio a las líneas vacías para evitar problemas con su supresión"}*/
    input = input
      .split("\n")
      .map((line) => {
        if (!line.trim().length) {
          return " ";
        }
        return line;
      })
      .join("\n");
    /*<-:*/

    /*:->{"type": "note", "name": "Bloques que no se abrazan", "content": "Se remueve el abrazo en los bloques que no lo requieren"}*/
    input = ResaltaProg({
      string: input,
      model: {
        rules: [
          {
            regex: new RegExp(/\x20+/.source + open.source, "g"),
            apply: function (frag) {
              let r = frag.substr;
              let structure = r.match(open)[0];
              structure = structure.replace(/\/\*:->!?/, "").replace("*/", "");
              structure = eval(`(${structure})`);
              if (["note", "title"].includes(structure.type)) {
                return r.trim();
              }
              return r;
            },
          },
        ],
      },
    });
    /*<-:*/


    /*:->{"type": "note", "name": "Reemplazos simples para abrazar", "content": "Reemplaza los comentarios de apertura y cierre para abrazar los bloques"}*/
    input = input
      .replace(
        /\/\*<-:\*\/\s*\/\*<-:\*\/\n+/g,
        "/\u002A<-:\u002A//\u002A<-:\u002A/\u0026123; "
      )
      .replace(/\/\*<-:\*\/\n+/g, "/\u002A<-:\u002A/\u0026123; ")
      .replace(/\{\s*\/\*:->\{/g, "{/\u002A:->{")
      .replace(/\{\s*\/\/:->/g, "{/\u002F:->")
      .replace(/\{\s*\/\/:->!/g, "{/\u002F:->!");
    /*<-:*/
    /*<-:*/
  }

  /*:->{"type": "note", "name": "Algoritmo de interrupción de la entrada en bloques"}*/
  let lines = 0;

  const stack = [];
  let results = [];
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(input)) !== null) {
    const isStart = checkIfOpenAgr(match[0]);
    const isEnd = close.find((e) => e == match[0]);
    if (isStart) {
      if (stack.length == 0) {
        results.push(input.substring(lastIndex, match.index));
        lastIndex = match.index;
      }
      stack.push(match.index);
    } else if (isEnd && stack.length > 0) {
      const start = stack.pop();
      if (stack.length == 0) {
        results.push(input.substring(start, match.index + isEnd.length));
      }
      lastIndex = match.index + isEnd.length;
    }
  }

  if (lastIndex < input.length) {
    results.push(input.substring(lastIndex));
  }
  /*<-:*/

  /*:->{"type": "note", "name": "No hubo bloques, retorna", huerotate: 6, content:"Después de procesar la entrada, no se encontraron interrupciones"}*/
  if (!results.length) {
    const string = transform(clean({ string: input }));
    return {
      string,
      lines: string.split("\n").length,
    };
  }
  /*<-:*/

  /*:->{"type": "note", "name": "Conversion de bloques en estructuras HTML", "content": "Convierte los bloques en estructuras HTML"}*/
  results = results.map((string) => {
    const isCollapsableBlock = checkIfOpenAgr(string);

    if (!isCollapsableBlock) {
      lines += string.trim().split("\n").length;
      return transform(string);
    }

    const m = string.match(open);
    let structure = (() => {
      return m[0].replace(/\x20*\/\*:->!?/g, "").replace(/\}\*\/$/, "}");
    })();

    structure = eval(`(${structure})`);

    let codeCollapse = string.replace(open, "");
    const c = close.find((c) => codeCollapse.endsWith(c));
    if (c) {
      codeCollapse = codeCollapse.substring(0, codeCollapse.length - c.length);
    }
    codeCollapse = clean({ string: codeCollapse });

    codeCollapse = extractGroups({
      input: codeCollapse,
      transform,
    });

    lines += codeCollapse.lines;

    const idC = Math.random().toString(36).replace("0.", "collapser-");
    const idR = Math.random().toString(36).replace("0.", "input-collapser-");
    const title = structure.name ?? "Código";
    const type = structure.type ?? "collapsable";
    const block = structure.block ?? true ? "block" : "";
    let hue = structure.huerotate;
    if (hue != undefined) {
      hue = hue.toString().replace(".", "-");
      hue = `huerotate${hue}`;
    } else {
      hue = "";
    }
    const clsMultiline = codeCollapse.lines > 1 ? "multiline" : "";

    let retorno = [
      `<div class="blockcmd ${type} ${hue}" id="${idC}">`,
      ...bloqueType(),
      `</div>`,
    ].join("");

    return retorno;

    function bloqueType() {
      switch (type) {
        case "collapsable":
          return bloqueCollapsable();
        case "prev":
        case "prev c":
          return bloquePrev();
        case "note":
          return bloqueNote();
        case "title":
        case "title doc":
          return bloqueTitle();
        case "no-code":
          return bloqueNoCode();
      }

      function bloquePrev() {
        return [
          ...herramientasDeBloque("-prev", true),
          `<label class="header-prev actionable" title="${`${title} (+${codeCollapse.lines})`
            .replaceAll("<b>", "")
            .replaceAll("</b>", "")}">`,
          `<input type="checkbox" ${
            !(structure.collapsed ?? true) ? "checked" : ""
          } id="${idR}">`,
          `<div class="title">`,
          `<span class="caret">`,
          `▾`,
          `</span>`,
          ` ${title}`,
          `<span class="morelines">`,
          ` (+${codeCollapse.lines})`,
          `</span>`,
          `</div>`,
          `</label>`,
          `<div class="body-prev ${clsMultiline} ${block}">`,
          `<label for="${idR}" class="collapser-prev actionable">`,
          `<div class="text">`,
          ` ▴ `,
          `</div>`,
          `</label>`,
          `<div class="code-prev">`,
          codeCollapse.string,
          `</div>`,
          `</div>`,
        ];
      }

      function bloqueTitle() {
        structure.separadorSuperior = false;
        structure.separadorInferior = false;
        return [
          ...auxNoCode(),
          `<div class="content-code">`,
          `<div class="code ${hue}">`,
          `${codeCollapse.string}`,
          `</div>`,
          `</div>`,
        ];
      }

      function bloqueNoCode() {
        return auxNoCode();
      }

      function auxNoCode() {
        const note = document.createElement("p");
        note.classList.add("content-html");
        note.innerHTML = structure.content ?? "";
        return [
          `<div class="body-nocode">`,
          ...(() => {
            if (structure.separadorSuperior === false) {
              return [];
            }
            return [`<hr/>`, `<br/>`];
          })(),
          ...(() => {
            const img = (() => {
              if (structure.logosvg) {
                return structure.logosvg;
              }
              if (structure.logo) {
                return `
                  <img src="${structure.logo}" alt="logo" />
                `;
              }
            })();
            if (!img) {
              return [];
            }
            return [
              `
              <div class="logo">
                ${img}
              </div>
            `,
            ];
          })(),
          `<div class="content-container">`,
          `<div class="content ${hue}">`,
          `<h2>`,
          `${structure.name}`,
          `</h2>`,
          note.outerHTML,
          `</div>`,
          ...(() => {
            if (structure.separadorInferior === false) {
              return [];
            }
            return [`<br/>`, `<hr/>`];
          })(),
          `</div>`,
          `</div>`,
        ];
      }

      function bloqueNote() {
        const note = document.createElement("p");
        note.classList.add("note-text");
        note.innerHTML = structure.content;
        if (!structure.content) {
          note.style.display = "none";
        }
        return [
          `<div class="body-note">`,
          `<div class="code-container">`,
          `<div class="triangle">`,
          `</div>`,
          `<div class="code ${hue}">`,
          `${codeCollapse.string}`,
          `</div>`,
          `</div>`,
          `<div class="content-container">`,
          `<div class="content ${hue}">`,
          `<h3 class="${!structure.content ? "compact" : ""}">`,
          `${structure.name}`,
          `</h3>`,
          note.outerHTML,
          `</div>`,
          `</div>`,
          `</div>`,
        ];
      }

      function bloqueCollapsable() {
        return [
          ...herramientasDeBloque(),
          `<label class="header actionable" title="${`${title} (+${codeCollapse.lines})`
            .replaceAll("<b>", "")
            .replaceAll("</b>", "")}">`,
          `<input type="checkbox" ${
            !(structure.collapsed ?? true) ? "checked" : ""
          } id="${idR}">`,
          `<div class="title">`,
          `<span class="caret">`,
          `▾`,
          `</span>`,
          ` ${title}`,
          `<span class="morelines">`,
          ` (+${codeCollapse.lines})`,
          `</span>`,
          `</div>`,
          `</label>`,
          `<div class="body ${clsMultiline} ${block}">`,
          `<label for="${idR}" class="collapser actionable">`,
          ` `,
          `</label>`,
          `<div class="code">`,
          codeCollapse.string,
          `</div>`,
          `</div>`,
        ];
      }
    }

    function herramientasDeBloque(sufix = "", more = false) {
      return [
        `<span class="herramientas${sufix}">`,
        ...[
          ...titulo(),
          `<span class="btns${sufix}">`,
          ...colapsadores(),
          ...botonDeInformacion(),
          `</span>`,
        ],
        `</span>`,
      ];

      function titulo() {
        return [
          `<div class="title">`,
          ...[`<span class="caret">`, `▴ `, `</span>`, `${title}`],
          `</div>`,
        ];
      }

      function colapsadores() {
        return [
          ...[
            `<span class="collapse-all actionable btn-basic" title="Collapsar todo" onclick="BlockcmdCollapser_collapse('${idC}')">`,
            ` - `,
            `</span>`,
          ],
          ...[
            `<span class="uncollapse-all actionable btn-basic" title="Expandir todo" onclick="BlockcmdCollapser_uncollapse('${idC}')">`,
            ` + `,
            `</span>`,
          ],
        ];
      }

      function botonDeInformacion() {
        if (!structure.content) {
          return [];
        }
        return [
          `<span class="info${sufix} actionable btn-basic">`,
          ...icono(),
          ...transformadoresDePosicionDeContenido(),
          `</span>`,
        ];

        function icono() {
          return [`<span class="icon">`, `💭`, `</span>`];
        }

        function transformadoresDePosicionDeContenido() {
          return [
            `<div class="container ${hue}">`,
            ...[
              `<div class="Ttx">`,
              ...[
                `<div class="adjX">`,
                ...[`<div class="adjY">`, ...contenido(), `</div>`],
                `</div>`,
              ],
              `</div>`,
            ],
            `</div>`,
          ];

          function contenido() {
            return [
              `<div class="content">`,
              `<span class="icon">`,
              `💭 Info`,
              `</span>`,
              `<br/>`,
              `<div class="title">${title}</div>`,
              `${structure.content ?? ""}`,
              ...(() => {
                if (more) {
                  return [`<div class="more">`, `⮟`, `</div>`];
                }
              })(),
              `</div>`,
            ];
          }
        }
      }
    }
  });
  /*<-:*/

  /*:->{"type": "note", "name": "Union y retorno en una sola cadena", huerotate: 6}*/
  const string = results.join("");

  return {
    string,
    lines,
  };
  /*<-:*/

  /*:->{"type": "title", "name": "Funciones auxiliares de procesamiento", huerotate: 8}*/
  function checkIfOpenAgr(str) {
    return ["/\u002A:->{", "/\u002A:->!{"].some((s) => str.includes(s));
  }

  function clean({ string }) {
    let retorno = string;
    retorno = trimLines(retorno);
    return retorno;

    function trimLines(str) {
      const lines = str.split("\n");
      const left = [];
      const right = [];
      let first = false;
      let last = false;
      while (lines.length) {
        const l = lines.shift();
        const r = lines.pop();
        first ||= l.trim();
        last ||= r?.trim();
        if (first) {
          left.push(l);
        }
        if (last) {
          right.push(r);
        }
      }
      let retorno = [left.join("\n"), right.reverse().join("\n")]
        .filter(Boolean)
        .join("\n");
      return retorno;
    }
  }
  /*<-:*/
  /*!<-:*/
}

function Resaltados() {
  /*:->!{"name": "Reglas de abrazo y creación de globos"}*/
  /*:->{"type": "note", "name": "Reglas para abrazar bloques y generar globos de renglón", "content": `Conjunto de reglas que procesan el abrazo de bloques y la generación de globos de renglón.`}*/
  return {
    rules: [
      /*:->{"type": "note", "name": "Reglas para abrazo de bloques con llaves", content: `Reglas relacionadas con el abrazado de bloques.`}*/
      {
        regex: /\x26123;\x20+\{/g,
        apply: function (frag) {
          const clase = "agr keycmds2";
          return `\n<span class="${clase}">${frag.substr.replace(
            "\x26123;",
            ""
          )}</span>`;
        },
      },

      {
        regex: /\x26123;\x20+\}\n+/g,
        apply: function (frag) {
          const clase = "agr keycmds";
          return `<span class="${clase}">${frag.substr.replace(
            "\x26123;",
            ""
          )}</span>\n\n`;
        },
      },

      {
        regex: /\x26123;\s+\}/g,
        apply: function (frag) {
          const clase = "agr keycmds";
          return `<span class="${clase}">${frag.substr.replace(
            "\x26123;",
            ""
          )}</span>`;
        },
      },
      {
        regex: /\x26123;\x20*/g,
        apply: function (frag) {
          return `<span class="agr keycmdsinv">\n</span><span class="agr keycmds">${frag.substr.replace(
            /\x26123;\x20?/g,
            ""
          )}</span>`;
        },
      },
      /*<-:*/
      /*:->{"type": "note", "name": "Regla para identificar y generar globos de renglón", "content": `Identifica, procesa y genera globos de renglón.`}*/
      {
        regex: /\/\/:->!?\x20[^\n]*\n?(\s+?\/\/[\s\S]*?(\n|$))*/g,
        apply: function (frag) {
          return globo(frag);
        },
      },
      /*<-:*/
    ],
  };
  /*<-:*/

  /*:->{"type": "note", "name": "Función para generar globos de renglón", "content": `Genera la estructura HTML de un globo de renglón.`}*/
  function globo(frag, fin = ["\n"]) {
    const clase = "ballon";
    frag.substr = frag.substr.replace(/\s+\/\//g, " ");
    const noL = frag.substr.startsWith("//:->!");
    const nFrag = frag.substr.replace("//:->" + (noL ? "!" : ""), "");
    return [
      `<span class="${clase}">`,
      ...[
        `<span class="icon">`,
        /*:->{"name": "Iconos decorativos y activadores", "content": `Iconos que se usan para decorar y caracterizar los globos`}*/
        ...[
          /*:->{"type": "note", "name": "Icono de que señala decorativo", "content": `se usa para decorar el globo de notas.`}*/
          ...[
            `<div class="hidethumb left">`,
            noL ? "&nbsp;&nbsp;" : "☝️",
            `</div>`,
          ],
          /*<-:*/
          /*:->{"type": "note", "name": "Icono activador del globo", 
          "content": `Representa el indicador de que hay un globo de notas en el renglón.`}*/
          `😁`,
          /*<-:*/
          /*:->{"type": "note", "name": "Icono de like decorativo", "content": `se usa para decorar el globo de notas.`}*/
          ...[`<div class="hidethumb like">`, `👍`, `</div>`],
          /*<-:*/
        ],
        /*<-:*/
        `</span>`,
        ...[
          /*:->{"type": "note", "name": "Contenido oculto", "content": `Contenido del globo`}*/
          `<div class="hide">`,
          ...[`<hr/>`, `<br/>`, nFrag, `<br/>`, `<br/>`, `<hr/>`],
          `</div>`,
          /*<-:*/
          /*:->{"type": "note", "name": "Contenido oculto sin texto visible", "content": `Su proposito servir de fondo por fuera del código.`}*/
          `<div class="hideback">`,
          ...[`<hr/>`, `<br/>`, nFrag, `<br/>`, `<br/>`, `<hr/>`],
          `</div>`,
          /*<-:*/
        ],
      ],
      `</span>`,
      ...fin,
    ].join("");
  }
  /*<-:*/
  /*!<-:*/
}
/*<-:*/

/*:->{"type": "note",huerotate: 2,
  "name": "Funciones secundarias",
  "content": `
    <p>Estas funciones se encargan de colapsar y expandir los bloques de código.
    Se consideran funciones secundarias porque aunque se definen de alcance global,
    su uso no está definido para que sea usado en otras partes de código.
    `,
}*/
function BlockcmdCollapser_collapse(id) {
  const node = document.querySelector(`#${id}`);
  [...node.querySelectorAll("input")].forEach((input) => {
    input.checked = false;
  });
}

function BlockcmdCollapser_uncollapse(id) {
  const node = document.querySelector(`#${id}`);
  [...node.querySelectorAll("input")].forEach((input) => {
    input.checked = true;
  });
}
/*<-:*/

/*:->{"type": "title", "name": "Procedimientos extra", huerotate: 8,
  "content": `
    <p>Necesarío para la ejecución de las funciones principales y secundarias.
   `
}*/
/*:->{"type": "note", "name": "Alcance global para funciones secundarias",
  "content": `
    <p>Para evitar problemas con los objetos DOM, ya que se crean a partir de texto,
    se definen funciones secundarias en el alcance global para que puedan ser usadas
    por las funciones principales.
    `,
}*/
Object.assign(window, {
  BlockcmdCollapser_collapse,
  BlockcmdCollapser_uncollapse,
});
/*<-:*/
/*<-:*/
