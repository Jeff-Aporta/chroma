/*:->{"type": "no-code", "name": "Modulo de resaltado de sintaxis para JavaScript",
"huerotate": 7, 
logo: `/src/img/logo.jpeg`,
"content": `
    <p>
      Este módulo contiene y procesa las reglas para el resaltado de sintaxis (Syntax Highlighting) de JavaScript.
    <p><br/>
      Esta es una versión personal, ya que las alternativas disponibles no cumplen con mis expectativas.
    <p align="right" style="color:white;"><br/>
    <b>Autor</b>: Jeffrey Agudelo (<a href="https://github.com/Jeff-Aporta" target="_blank">Jeff-Aporta</a>)
  `}*/
/*<-:*/

import { Resaltados as cmds } from "./cmds.mjs";

/*:->{"type": "title doc", "name": "Expresion para reconocer cadenas de texto multilinea",
content: `
  Patrón definido que permite reconocer cadenas de texto multilinea, se usa para enmascarar y evitar conflictos.
`}*/
const strtemp =
  /`(((([^`]*?\$\{([^]*?((([^]*?((\$\{([^]*?((\$\{[^]*?\}[^]*?\}[^]*?\})|\}[^]*?\}))|\}))))|\})))+[^`]*?`)+)|([^`]*?`))/g;
/*<-:*/

/*:->{"type": "title", "name": "Exportación del módulo",
huerotate: 5,
content: `
  Objeto que contiene las funciones y reglas necesarias para el resaltado de sintaxis de JavaScript.
`}*/
export default {
  /*:->{"type": "note", "name": "Protocolo de resaltado de sintaxis JS", huerotate: 7,
  content: `
    Conjunto de reglas y procedimientos que generan el HTML que resalta la sintaxis de JavaScript.
  `}*/
  name: ["js", "mjs", "javascript"], //:-> Nombres que identifican el lenguaje.

  mask: mascaraRegexString, //:-> Función que genera la mascara de texto.

  /*:->{"type": "title doc", "name": "Preparar",
  content: `
    <p>Uniformiza los saltos de línea, tabulaciones y espacios.
    <p>Agrega comentarios de colapsado automático a estructuras de control y funciones.
    <p><b>string:</b> Cadena de texto a procesar
    <p><b>Retorna:</b> Cadena de texto modificada, lista para ser procesada por los demás protocolos.
  `}*/
  preparar: function ({ string, tabspaces, autocollapse }) {
    /*:->!{"name": "Procedimiento de preparación"}*/
    /*:->{"type": "note", "name": "Retorna, no hay texto para procesar",
    content: `
      Si la entrada de texto está vacía, se retorna sin hacer cambios.
    `}*/
    if (!string) {
      return string;
    }
    /*<-:*/
    /*:->{"type": "prev c", "name": "Procesamiento de entrada", huerotate: 6,
    content: "Realiza modificaciones a la cadena de texto, antes de que pase por protocolos de resaltado."}*/
    /*:->{"type": "note", "name": "Modificación de reemplazo simple"}*/
    string = string
      .replace(/\r/g, "\n")
      .replace(/\}\n\n+/g, "}\n")
      .replace(/\t/g, " ".repeat(tabspaces));
    /*<-:*/
    /*:->{"type": "note", "name": "RegExs repetitivos"}*/
    const args = /\([^]*?\)/;
    const noTenerColapsador = /(?!\s*\/\*:->!?\{)(?!\s*\/\/:->)/;
    const open = /(?<!:->!?\s*)\s*\{/;
    const openBrkt = /\[/;
    /*<-:*/

    let mascara = mascaraRegexString(string);

    /*:->{"type": "note", "name": "Identificación y colapsado automático"}*/
    [
      {
        re: new RegExp(
          `\\w+:\\s*function\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: (head) => {
          return `/\u002A:->!\{ name: "Cuerpo de método <b>(${head})</b>" \}\u002A/\n`;
        },
      },
      {
        re: new RegExp(
          `function\\s*\\w*\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: (head) => {
          const name = (() => {
            const a = head.split("(")[0].replace("function", "").trim();
            if (a.length > 20) {
              return a.slice(0, 18) + "…";
            }
            return a;
          })();
          const ref = !name ? "" : `(${name})`;
          return `/\u002A:->!\{ name: "Cuerpo de función <b>${ref}</b>" \}\u002A/\n`;
        },
      },
      {
        re: new RegExp(
          `\\w+\\s*:\\s*\\(${args.source}\\s*=>${open.source}${noTenerColapsador.source}(?=[^]*?\\}\\)\\(\\),)`,
          "g"
        ),
        inicioDeBloque: (head) => {
          return `/\u002A:->!\{ name: "Constructor de prop <b>(${head})</b>" \}\u002A/\n`;
        },
      },
      {
        re: new RegExp(
          `${args.source}\\s*=>${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo lambda" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `\\w+\\s*=>\\s*${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo lambda" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `\\w+\\s*:\\s*\\(${args.source}\\s*=>${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo prop" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `while\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de repetición <b>(while)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(`do${open.source}${noTenerColapsador.source}`, "g"),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de repetición <b>(do-while)</b>" \}\u002A/\n`,
      },
      {
        re: /function\s+\w+\s*\(\{(?!(?=\s+\/\*:->!?\{)[\s\S]*?\}\))/g,
        inicioDeBloque: (head) => {
          const name = head.split("(")[0].replace("function", "").trim();
          return `/\u002A:->!\{ name: "Args. destruct. de <b>(${name})</b>" \}\u002A/\n`;
        },
      },
      {
        re: /\(\s*\{(?!(?=\s+\/\*:->!?\{)[\s\S]*?\}\))/g,
        inicioDeBloque: `/\u002A:->!\{ name: "Args destruct" \}\u002A/\n`,
        open: "(",
        close: ")",
      },
      {
        re: new RegExp(
          `for\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de repetición <b>(for)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `else\\s+if\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de condición alterna <b>(else-if)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `else\\s*${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de condición falsa <b>(else)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `if\\s*${args.source}\\s*${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de condición verdadera <b>(if)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `switch\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de conmutación <b>(switch)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(`return${open.source}${noTenerColapsador.source}`, "g"),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de objeto <b>(retorno)</b>" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `\\w+\\s*:${open.source}${noTenerColapsador.source}(?=(\\s*\\w+:[^]*?,)+\\s*\\})`,
          "g"
        ),
        inicioDeBloque: (head) => {
          return `/\u002A:->!\{ name: "Cuerpo de objeto <b>(${head})</b>" \}\u002A/\n`;
        },
      },
      {
        re: new RegExp(
          `(const|let|var)\\x20*${open.source}${noTenerColapsador.source}(?=(\\s*(\\w+[^]*?,)+\\s*\\w*\\s*\\}))`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Vars. destruct." \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `\\x20*${open.source}${noTenerColapsador.source}(?=(\\s*\\w+:[^]*?,)+\\s*\\})`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de objeto" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `\\s*${args.source}${open.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo génerico" \}\u002A/\n`,
      },
      {
        re: new RegExp(
          `return\\x20+\\w+\\((?!\\s*[\\{\\[\\(])${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: (head) => {
          const name = head.split("(")[0].replace("return", "").trim();
          return `/\u002A:->!\{ name: "Args de <b>(${name}: retornado)</b>" \}\u002A/\n`;
        },
        open: "(",
        close: ")",
      },
      {
        re: new RegExp(
          `\\w+\\x20+[=:]\\x20+\\w+\\((?!\\s*[\\{\\[\\(])${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: (head) => {
          const sentencia = head.split("(")[0];
          const [name, f] = sentencia.split(/[=:]/).map((s) => s.trim());
          return `/\u002A:->!\{ name: "Args de <b>(${f} en ${name})</b>" \}\u002A/\n`;
        },
        open: "(",
        close: ")",
      },
      {
        re: (()=>{
          const funcion = /\w+\(/;
          const noTenerCuerpoEspecialDentro = /(?!\s*[\{\[\(])/;
          const noTenerLambda = /(?!\s*\w+\s*=>)(?!\s*(async)\s+)/;
          const noTener = `${noTenerCuerpoEspecialDentro.source}${noTenerLambda.source}`;
          return new RegExp(
            `${funcion.source}${noTener}${noTenerColapsador.source}`,
            "g"
          )
        })(),
        inicioDeBloque: (head) => {
          const name = head.split("(")[0].trim();
          return `/\u002A:->!\{ name: "Args de <b>(${name})</b>" \}\u002A/\n`;
        },
        open: "(",
        close: ")",
      },
      {
        re: new RegExp(
          `return\\x20+${openBrkt.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de arr. <b>(retornado)</b>" \}\u002A/\n`,
        open: "[",
        close: "]",
      },
      {
        re: new RegExp(
          `\\w+\\x20*[=:]\\s*${openBrkt.source}${noTenerColapsador.source}(?!\\])`,
          "g"
        ),
        inicioDeBloque: (head) => {
          const s = (() => {
            const [ieq, idc] = ["=", ":"]
              .map((c) => head.indexOf(c))
              .map((i) => (i == -1 ? Infinity : i));
            if (ieq < idc) {
              return "=";
            }
            return ":";
          })();
          const name = head.split(s)[0].trim();
          return `/\u002A:->!\{ name: "Arr. asignado a <b>(${name})</b>" \}\u002A/\n`;
        },
        open: "[",
        close: "]",
      },
      {
        re: new RegExp(
          `\\x20*${openBrkt.source}${noTenerColapsador.source}`,
          "g"
        ),
        inicioDeBloque: `/\u002A:->!\{ name: "Cuerpo de arr." \}\u002A/\n`,
        open: "[",
        close: "]",
      },
    ].forEach((rule) => {
      if (!autocollapse) {
        return;
      }
      const { open = "{", close = "}" } = rule;
      string = colapsadoAutomatico({ string, rule, open, close });
    });
    /*<-:*/
    /*<-:*/

    /*:->{"type": "note", "name": "Retorna, la entrada ha sido procesada"}*/
    return string;
    /*<-:*/

    /*:->{"type": "prev c", "name": "Funciones de procesamiento", huerotate: 6,
    content: `
      Funciones que procesan la cadena de texto, para generar comentarios de colapsado.
    `}*/
    /*:->{"type": "title doc", "name": "Colapsado automático de bloques",
    content: `
      Realiza la inserción de comentarios para colapsar bloques de código que superen las 3 líneas.
      <p><b>string:</b> Cadena de texto a procesar
      <p><b>rule:</b> Regla de reconocimiento de inicio de bloque
      <p><b>ignoreIndex:</b> Indice de inicio de búsqueda, se basa en la última inserción
      <p><b>open:</b> Caracter de apertura de bloque, puede ser { o [
      <p><b>close:</b> Caracter de cierre de bloque, puede ser } o ]
      <p><b>Retorna:</b> Cadena de texto con comentarios de colapsado insertados
    `}*/
    function colapsadoAutomatico({
      string,
      rule,
      open,
      close,
      ignoreIndex = 0,
    }) {
      let match;
      const { re, inicioDeBloque } = rule;

      while ((match = re.exec(mascara)) !== null) {
        if (match.index >= ignoreIndex) {
          //:-> Se ignoran las coincidencias que están en una posición ya procesada.
          aplicar({ open, close });
        }
      }

      function aplicar({ open, close }) {
        const indexStartLoop = match.index + match[0].length; //:-> Se obtiene el índice de inicio para la búsqueda del cierre del bloque.
        let indexEndFunction; //:-> Va ha ser calculado a continuación y representará el índice de cierre del bloque.
        let last_n; //:-> Va ha ser calculado a continuación y representará el índice del último salto de línea, para que la llave de
        //cierre conserve la misma indentación original.
        let first_char; //:-> Va ha ser calculado a continuación y representará el índice del primer caracter no espacio o salto de línea.
        //para que la primera línea de código del bloque tenga la misma indentación original.
        let contador = 1; //:-> Se inicializa en 1, ya que se asume que el bloque está abierto.
        //Su función es determinar la cantidad de llaves de apertura y cierre que se encuentran en el bloque.
        //Si el contador llega a 0, se asume que el bloque se ha cerrado.

        /*:->{"type": "note", "name": "Búsqueda de cierre de bloque",
        huerotate: 1,
        content: `
          Se busca el cierre del bloque, se usa la variable close para determinar el caracter de cierre.
        `}*/
        mascara.split("").forEach((char, index, arr) => {
          if (index < indexStartLoop) {
            //:-> <b>La busqueda no ha iniciado</b><p>Se ignoran los caracteres que están antes del inicio del bloque.
            return;
          }

          if (indexEndFunction) {
            //:-> <b>La busqueda no ha finalizado</b>
            //<p>Se ha encontrado el cierre del bloque, se termina la búsqueda.
            return;
          }
          /*:->{"type": "note", "name": "Identación de primer línea de código",
          content: `
            Se identifica el primer caracter que no sea espacio o salto de línea, para determinar la indentación de 
            la primera línea de código del bloque.
          `}*/
          if (!first_char) {
            if (char != " " && char != "\n") {
              first_char = index;
            }
          }
          /*<-:*/
          /*:->{"type": "note", "name": "Procesamiento de caracteres relevantes",
          content: `
            Se procesan los caracteres relevantes para determinar el cierre del bloque.
            <p>Se actualiza la variable last_n, cuando se encuentra un salto de línea.
            <p>Se actualiza la variable contador, cuando se encuentra un caracter de apertura o cierre.
            <p>Se actualiza la variable indexEndFunction, cuando el contador llega a 0.
          `}*/
          switch (char) {
            case "\n":
              last_n = index;
              break;
            case open:
              contador++;
              break;
            case close:
              contador--;
              if (contador == 0) {
                indexEndFunction = index;
              }
              break;
          }
          /*<-:*/
        });
        /*<-:*/

        ignoreIndex = indexStartLoop + 1; //:-> <b>Nueva posición para inicio de búsqueda</b>
        //<p>Se actualiza la posición de inicio de búsqueda, para ignorar la búsqueda de bloques ya procesados.

        /*:->{"type": "note", "name": "Retorna, No se encontró cierre de bloque",
        huerotate: 4,
        content: `
          Si no se encuentra el cierre del bloque, se retorna sin hacer cambios.
          <p>Es posible que esto ocurra por un error de sintaxis.
        `}*/
        if (contador != 0) {
          return;
        }
        /*<-:*/

        /*:->{"type": "note", "name": "Se estima la cantidad de líneas de código contenidas",
        content: `
          función es estética, ya que este valor se anexa al titulo del bloque colapsado.
          <p>Evita que se colapsen bloques de código muy pequeños.
        `}*/
        let lines = string
          .slice(indexStartLoop, indexEndFunction)
          .trim()
          .replaceAll("\n\n", "\n");

        coms().forEach((com) => {
          lines = lines.replace(com.regex, "");
        });

        lines = lines.split("\n").length;
        /*<-:*/

        /*:->{"type": "note", "name": "Solo colapsa bloques de más de 3 líneas",
          content: `
            Solo se colapsan los bloques que superen las 3 líneas de código.
            Con el fin de no exagerar con la cantidad de colapsamientos automáticos.
          `}*/
        if (lines >= 3) {
          const reConfirmar = new RegExp(re.source, "g").exec(
            mascara.slice(match.index, indexEndFunction + 10)
          );

          /*:->{"type": "note", "name": "Encabezado del bloque",
          content: `
            Representa la estructura previa a la apertura del bloque.
            <p>se usa para personalizar el título del bloque colapsado.
          `}*/
          const head = string
            .slice(match.index, indexStartLoop)
            .trim()
            .split(":")[0];
          /*<-:*/

          /*:->{"type": "note", "name": "Inserta el comentario que colapsa el bloque",
          content: `
            Concatena la estructura de inicio de bloque con el comentario de colapsado.
          `}*/
          const estructuraConInicioDeColapsamiento = (() => {
            if (typeof inicioDeBloque == "function") {
              return inicioDeBloque(head, mascara);
            }
            return inicioDeBloque;
          })();
          /*<-:*/

          if (reConfirmar) {
            /*:->{"type": "note", "name": "Se inserta el comentario final de colapsado",
            content: `
              Por tema de fenómeno de modificación de indices, se inserta primero el comentario de cierre.
              <p>Ya que si se inserta primero el comentario de apertura, tocaría recalcular los indices para la inserción del cierre.
            `}*/
            string = insertStringAtPosition(
              string,
              "/\u002A!<-:\u002A/",
              last_n
            );
            /*<-:*/
            /*:->{"type": "note", "name": "Se inserta el comentario de apertura de colapsado",
            content: `
              Una vez insertado el comentario de cierre, se inserta el comentario de apertura.
            `}*/
            string = insertStringAtPosition(
              string,
              estructuraConInicioDeColapsamiento +
                "\n" +
                " ".repeat(Math.max(0, first_char - indexStartLoop - 2)),
              first_char
            );
            /*<-:*/
            /*:->{"type": "title", "name": "Se actualiza la mascara",
            content: `
              Para que la mascara esté actualizada con los cambios realizados.
              y siga siendo reflejo de la cadena de texto.
            `}*/
            mascara = insertStringAtPosition(
              mascara,
              "/\u002A!<-:\u002A/",
              last_n
            );
            mascara = insertStringAtPosition(
              mascara,
              estructuraConInicioDeColapsamiento +
                "\n" +
                " ".repeat(Math.max(0, first_char - indexStartLoop - 2)),
              first_char
            );
            /*<-:*/
          }
        }
        /*<-:*/
      }
      return string;
    }
    /*<-:*/

    function insertStringAtPosition(originalString, insertString, position) {
      return (
        originalString.slice(0, position) +
        insertString +
        originalString.slice(position)
      );
    }
    /*<-:*/
    /*!<-:*/
  },
  /*<-:*/

  /*:->!{type: "title doc", name: "Reglas de lenguaje JS",
  content: `
    Conjunto de reglas que se usan para procesar el texto y generar el resaltado de sintaxis.
  `}*/
  rules: (() => {
    /*:->!{"name": "Reglas de lenguaje"}*/
    return [
      ...cmds().rules,
      ...regexs(),
      ...comsInevit(),
      ...strs(),
      ...coms(),
      ...nums(),
      ...kwds(),
      ...calls(),
      ...agrps(),
      ...oprs(),
    ];

    /*:->{"type": "prev c", "name": "Reglas no conflictivas", huerotate: 3,
    content: `
      Definición de reglas que no generan conflictos con otras reglas.
    `}*/
    /*:->{"type": "title doc", "name": "Reconocimiento de números",
    content: `
      Reglas que permiten reconocer y resaltar los números en el texto de entrada.
    `}*/
    function nums() {
      return [
        {
          regex: /(\b\d+\b)|(\b\d+\.\d+\b)|(\b\.\d+\b)/g,
          apply: function (frag) {
            const clase = "num";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },
      ];
    }
    /*<-:*/

    /*:->{"type": "title doc", "name": "Reconocimiento de palabras reservadas",
    content: `
      Reglas que permiten reconocer y resaltar las palabras reservadas en el texto de entrada.
    `}*/
    function kwds() {
      return [
        {
          regex: (() => {
            const kwd = `
                let const var typeof void in instanceof delete of
              `;
            return new RegExp(
              `\\b(${kwd.trim().replace(/\s+/g, "|")})\\b`,
              "g"
            );
          })(),
          apply: function (frag) {
            const clase = "kwd reserved";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
                function
            `;
            return new RegExp(
              `\\b(${kwd.trim().replace(/\s+/g, "|")})\\b`,
              "g"
            );
          })(),
          apply: function (frag) {
            const clase = "kwd reserved type2";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
                true false null undefined NaN Infinity this
            `;
            return new RegExp(`\\b(${kwd.trim().replace(/ /g, "|")})\\b`, "g");
          })(),
          apply: function (frag) {
            const clase = "kwd value";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: [
            (() => {
              const kwd = `
                global process Buffer require module exports
              `;
              return [
                new RegExp(`\\b(${kwd.trim().replace(/ /g, "|")})\\b`, "g"),
                /export default/g,
              ];
            })(),
            /default as/g,
          ],
          apply: function (frag) {
            const clase = "kwd node";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const control = `
                if else for while do break continue 
                switch case default try catch throw finally
              `;
            return new RegExp(
              `\\b(${control.trim().replace(/\s+/g, "|")})\\b`,
              "g"
            );
          })(),
          apply: function (frag) {
            const clase = "kwd control";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const control = `
                return
              `;
            return new RegExp(
              `\\b(${control.trim().replace(/\s+/g, "|")})\\b`,
              "g"
            );
          })(),
          apply: function (frag) {
            const clase = "kwd control2";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
                Array Object String Number Boolean Function Symbol BigInt
            `;
            return new RegExp(`\\b(${kwd.trim().replace(/ /g, "|")})\\b`, "g");
          })(),
          apply: function (frag) {
            const clase = "kwd type";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
              async await
            `;
            return new RegExp(`\\b(${kwd.trim().replace(/ /g, "|")})\\b`, "g");
          })(),
          apply: function (frag) {
            const clase = "kwd async";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
              import export from as default
            `;
            return new RegExp(`\\b(${kwd.trim().replace(/ /g, "|")})\\b`, "g");
          })(),
          apply: function (frag) {
            const clase = "kwd import";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
              new class extends super constructor
            `;
            return new RegExp(`\\b(${kwd.trim().replace(/ /g, "|")})\\b`, "g");
          })(),
          apply: function (frag) {
            const clase = "kwd class";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const kwd = `
              Error TypeError ReferenceError SyntaxError 
              RangeError EvalError URIError
            `;
            return new RegExp(
              `\\b(${kwd.trim().replace(/\s+/g, "|")})\\b`,
              "g"
            );
          })(),
          apply: function (frag) {
            const clase = "kwd error";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },
      ];
    }
    /*<-:*/

    /*:->{"type": "title doc", "name": "Reconocimiento de agrupadores",
    content: `
      Reglas que permiten reconocer y resaltar los agrupadores en el texto de entrada.
    `}*/
    function agrps() {
      return [
        {
          regex: (() => {
            const chrs = "\\( \\)";
            return new RegExp(`${chrs.split(" ").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "agr par";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "[]";
            return new RegExp(
              `${chrs
                .split("")
                .map((c) => `\\${c}`)
                .join("|")}`,
              "g"
            );
          })(),
          apply: function (frag) {
            const clase = "agr brk";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "{}";
            return new RegExp(`${chrs.split("").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "agr key";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },
      ];
    }
    /*<-:*/

    /*:->{"type": "title doc", "name": "Reconocimiento de operadores",
    content: `
      Reglas que permiten reconocer y resaltar los operadores en el texto de entrada.
    `}*/
    function oprs() {
      return [
        {
          regex: (() => {
            const chrs = "\\.\\.\\.";
            return new RegExp(`${chrs}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr destruct";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const sec = "=>";
            return new RegExp(`${sec}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr arrow";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = ",;:";
            return new RegExp(`${chrs.split("").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr sep";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs =
              "\\|\\|= \\?\\?= \\*\\*= >>>= \\+= \\*= \\/= &&= \\|= \\^= <<= >>= -= %= &=";
            return new RegExp(`${chrs.split(" ").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr asgn";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "&& \\|\\| \\?\\?";
            return new RegExp(`${chrs.split(" ").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr logic complex";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "<< >>> >> \\& \\| \\^ ~";
            return new RegExp(`${chrs.split(" ").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr bit";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "=== !== == != <= < >= >";
            return new RegExp(`${chrs.split(" ").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr comp";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: [
            (() => {
              const chrs = "\\+ \\- \\* \\/ %";
              return new RegExp(`${chrs.split(" ").join("|")}`, "g");
            })(),
            (() => {
              const chrs = "\\*\\*";
              return new RegExp(`${chrs.split(" ").join("|")}`, "g");
            })(),
          ],
          apply: function (frag) {
            const clase = "opr arit";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "\\+\\+ --";
            return new RegExp(`\\d*${chrs.split(" ").join("|")}\\d*`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr inc";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chrs = "!";
            return new RegExp(`${chrs.split(" ").join("|")}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr logic simple";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },

        {
          regex: (() => {
            const chr = "=";
            return new RegExp(`${chr}`, "g");
          })(),
          apply: function (frag) {
            const clase = "opr eq";
            return `<span class="${clase}">${frag.substr}</span>`;
          },
        },
      ];
    }
    /*<-:*/

    /*:->{"type": "title doc", "name": "Reconocimiento de llamadas a funciones y atributos",
    content: `
      Reglas que permiten reconocer y resaltar las llamadas a funciones y atributos en el texto de entrada.
    `}*/
    function calls() {
      return [
        {
          regex: [
            /[a-zA-Z0-9]+(\??\.[a-zA-Z0-9_]+)+(?=\()/g,
            /\x20(\??\.[a-zA-Z0-9_]+)+(?=\()/g,
            /[a-zA-Z0-9_]+(?=\()/g,
          ],
          apply: function (frag) {
            const clase = `call fn`;
            const parts = frag.substr.split(".");
            const lastPart = parts.pop();
            const mainCaller = parts.shift();
            const alone = !mainCaller ? "alone" : "";

            const callsParts = ResaltadoLlamadas(parts);

            return [
              `<span class="${clase}">`,
              ...[
                ...(() => {
                  if (mainCaller) {
                    return [`<span class="main">`, mainCaller, `</span>`];
                  }
                  return [];
                })(),
                callsParts.length ? "." : "",
                callsParts.join("."),
                (() => {
                  if (mainCaller) {
                    return ".";
                  }
                  return "";
                })(),
                `<span class="last ${alone}">`,
                lastPart,
                `</span>`,
              ],
              `</span>`,
            ].join("");
          },
        },
        {
          regex: [
            /[a-zA-Z0-9]+(\??\.[a-zA-Z0-9_]+)+/g,
            /\x20(\??\.[a-zA-Z0-9_]+)+/g,
          ],
          apply: function (frag) {
            const clase = `call atr`;
            const parts = frag.substr.split(".");
            const mainCaller = parts.shift();
            const callsParts = ResaltadoLlamadas(parts);

            return [
              `<span class="${clase}">`,
              ...[
                `<span class="main">`,
                ...[mainCaller],
                `</span>`,
                callsParts.length ? "." : "",
                callsParts.join("."),
              ],
              `</span>`,
            ].join("");
          },
        },
      ];

      /*:->{"type": "title doc", "name": "Resaltado de llamadas a funciones o atributos",
      content: `
        Se resaltan las llamadas a funciones o atributos, se separan los elementos de la cadena de texto.
        <p>Se resalta el primer elemento como el llamador principal.
        <p>Se resaltan los elementos restantes como llamadas a atributos o funciones.
        <p><b>parts:</b> Arreglo con los elementos de la llamada que están separados por puntos.
        <p><b>Retorna:</b> texto HTML con las partes resaltadas y clases correspondientes.
      `}*/
      function ResaltadoLlamadas(parts) {
        return ResaltaProg({
          string: parts,
          model: {
            rules: [
              {
                regex: (() => {
                  const kwd = `
                    getElementsByClassName createDocumentFragment 
                    getElementsByTagName removeEventListener getElementsByName 
                    querySelectorAll addEventListener removeAttribute 
                    getElementById createTextNode querySelector dispatchEvent 
                    createElement getAttribute setAttribute replaceChild 
                    insertBefore appendChild removeChild classList
                    innerHTML outerHTML createElement
                  `;
                  return new RegExp(
                    `(${kwd.trim().replace(/\s+/g, "|")})`,
                    "g"
                  );
                })(),
                apply: function (frag) {
                  const clase = `DOM case`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },

              {
                regex: /^[A-Z]+_[A-Z_\d]+$/g,
                apply: function (frag) {
                  const clase = `snake upper case`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },

              {
                regex: /^[a-z]+[a-z\d]_[a-z_\d]*$/g,
                apply: function (frag) {
                  const clase = `snake lower case`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },

              {
                regex: /^[A-Z][a-z]+([A-Z][a-z\d]+)+$/g,
                apply: function (frag) {
                  const clase = `camel case primary`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },

              {
                regex: /^[a-z]+([A-Z][a-z\d]+)+$/g,
                apply: function (frag) {
                  const clase = `camel case secondary`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },

              {
                regex: /^[a-z]+[a-z\d]*$/g,
                apply: function (frag) {
                  const clase = `lower case`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },

              {
                regex: /^[A-Z]+[A-Z\d]*$/g,
                apply: function (frag) {
                  const clase = `upper case`;
                  return `<span class="${clase}">${frag.substr}</span>`;
                },
              },
            ],
          },
        });
      }
      /*<-:*/
    }
    /*<-:*/
    /*<-:*/
    /*!<-:*/
  })(),
  /*<-:*/
  /*<-:*/
};
/*<-:*/

/*:->{"type": "title", "name": "Expresiones de conflicto", "huerotate": 8, 
"content": `Se definen las expresiones que generan problema por su naturaleza de poder contener elementos 
de cierre y apertura de bloques`}*/
/*:->{"type": "prev", "name": "RegExs conflictivas para agrupación automática",
content: `
<p>En algunos casos, los caracteres de cierre o apertura pueden estar presentes en otras estructuras,
lo que puede generar errores en la agrupación.`}*/
/*:->{"type": "title doc", "name": "Inevitablemente es un comentario", 
content: `
  Reconoce estructuras que inevitablemente son comentarios, que no pueden ser confundidos con regex o cadenas de texto.
  <p><b>Retorna:</b> Un arreglo con las reglas correspondientes a comentarios inevitables
`}*/
function comsInevit() {
  return [
    {
      regex: /\/\/\x20[^\n]+/g,
      apply: function (frag) {
        const clase = "com line";
        return `<span class="${clase}">${frag.substr}</span>`;
      },
    },
  ];
}
/*<-:*/

/*:->{"type": "title doc", "name": "Expresiones regulares",
content: `
  Reconoce estructuras que son expresiones regulares, usa la estraegia de enmascarado para evitar conflictos.
  <p><b>Retorna:</b> Un arreglo con las reglas correspondientes a expresiones regulares
`}*/
function regexs() {
  return [
    {
      regex: /\/(?!\*)[^\n]+?\/[gimsuy]*(?=\.|,|;|\s|\])/g,
      charMask: "⼕",
      regexmask: /⼕+/g,
      apply: function (frag) {
        const clase = "regex";
        return `<span class="${clase}">${HTMLForce(frag.substr)}</span>`;
      },
    },
  ];
}
/*<-:*/

/*:->{"type": "title doc", "name": "Cadenas de texto",
content: `
  Reconoce estructuras que representan cadenas de texto, usa la estraegia de enmascarado para evitar conflictos.
  <p><b>Retorna:</b> Un arreglo con las reglas correspondientes a cadenas de texto
`}*/
function strs() {
  return [
    {
      regex: strtemp,
      regexmask: /⍽+/g,
      charMask: "⍽",
      apply: function (frag) {
        const clase = "str temp";
        return `<span class="${clase}">${HTMLForce(frag.substr)}</span>`;
      },
    },

    {
      regex: [/"(\\.|[^"\n])*"/g, /'(\\.|[^'\n])*'/g],
      regexmask: /╮+/g,
      charMask: "╮",
      apply: function (frag) {
        const clase = "str line";
        return `<span class="${clase}">${HTMLForce(frag.substr)}</span>`;
      },
    },
  ];
}
/*<-:*/

/*:->{"type": "title doc", "name": "Comentarios",
content: `
  Reconoce comentarios en el código proporcionado, también usa la estraegia de enmascarado para evitar conflictos.
  <p><b>Retorna:</b> Un arreglo con las reglas correspondientes a comentarios
`}*/
function coms() {
  return [
    {
      regex: /\/\/[^;gisy][^\n]+/g,
      apply: function (frag) {
        const clase = "com line";
        return `<span class="${clase}">${frag.substr}</span>`;
      },
    },
    {
      regex: /\/\*[\s\S]*?\*\//g,
      apply: function (frag) {
        const clase = "com block";
        return `<span class="${clase}">${frag.substr}</span>`;
      },
    },
  ];
}
/*<-:*/
/*<-:*/

/*:->{"type": "title doc", "name": "Generación de máscara",
content: `La máscara se genera a partir de la entrada, se usa como apoyo para ignorar llaves y 
corchetes en comentarios, cadenas y expresiones regulares.
<p>El algoritmo de agrupación automatica lo requiere para no cerrar la agrupación de manera erronea
<p><b>str:</b> Cadena de texto a procesar
<p><b>Retorna:</b> Cadena de texto transformada, con estructuras conflictivas enmascaradas
`}*/
function mascaraRegexString(str) {
  str = ResaltaProg({
    string: str,
    model: {
      rules: [
        ...regexs().map((rule) => {
          rule.apply = function (frag) {
            return rule.charMask.repeat(frag.substr.length);
          };
          return rule;
        }),
      ],
    },
  });
  str = ResaltaProg({
    string: str,
    model: {
      rules: [
        ...strs().map((rule) => {
          rule.apply = function (frag) {
            return rule.charMask.repeat(frag.substr.length);
          };
          return rule;
        }),
      ],
    },
  });
  str = ResaltaProg({
    string: str,
    model: {
      rules: [
        ...[...comsInevit(), ...coms()].map((rule) => {
          rule.apply = function (frag) {
            const apline = "/\u002F:->";
            if (frag.substr.startsWith(apline)) {
              return apline + "x".repeat(frag.substr.length - apline.length);
            }
            if (
              ["/\u002A:->{", "/\u002A:->!{"].some((s) =>
                frag.substr.startsWith(s)
              )
            ) {
              let o = false;
              return frag.substr
                .split("")
                .map((c) => {
                  if (c == "{") {
                    o = true;
                    return c;
                  }
                  if (o) {
                    return "-";
                  }
                  return c;
                })
                .join("");
            }
            return "x".repeat(frag.substr.length);
          };
          return rule;
        }),
      ],
    },
  });
  return str;
}
/*<-:*/
/*<-:*/

/*:->{"type": "title", "name": "Funciones auxiliares", huerotate: 5,
content: `
  Funciones que son usada en diversos procesos, pero no son parte del núcleo del algoritmo.
`}*/
/*:->{"type": "title doc", "name": "Solución a caracteres conflictivos en HTML", 
content: `En las cadenas de texto, se reemplazan los caracteres especiales por sus entidades HTML.
<p><b>Retorna:</b> Cadena de texto con entidades HTML`}*/
function HTMLForce(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/*<-:*/
/*<-:*/
