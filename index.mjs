/*:->{"type": "no-code", "name": "Modulo Principal para Resaltar Programación", 
"huerotate": 7, 
logo: `/src/img/logo.jpeg`,
"content": `
    <p>
    Este módulo maneja y gestiona los diferentes módulos que resaltan la sintaxis de los lenguajes de programación.
    <p>Procesa el protocolo general para escoger y ejecutar el proceso de resaltado.
    <p class="right white"><br/>
    <b>Autor</b>: Jeffrey Agudelo (<a href="https://github.com/Jeff-Aporta" target="_blank">Jeff-Aporta</a>)
  `}*/
/*<-:*/

/*:->{"type": "title", "name": "Carga de módulos", content:"Dependencias JS y CSS", huerotate: 7.5}*/
/*:->{"type": "note", "name": "Carga de módulos JS", content: "Módulos que complementan el sistema, fragmentación de mantenibilidad."}*/
import { default as lang_js } from "https://jeff-aporta.github.io/ResaltaProgJS/src/app/langs/js.mjs"; //:-> Sintaxis de JavaScript
import { default as cmds } from "https://jeff-aporta.github.io/ResaltaProgJS/src/app/langs/cmds.mjs"; //:-> Gestionador de agrupaciones HTML
/*<-:*/

/*:->{"type": "note", "name": "Carga de módulos CSS", content: "Se inyectan las etiquetas link en el documento."}*/
(() => {
  //:-> Inyección de elementos HTML en el documento
  const links = document.querySelectorAll("link[rel='stylesheet']");
  const sufijosCSS = [
    "theme-nightblue",
    "theme-night",
    "theme-light",
    "collapsable",
    "note",
    "title",
    "prev",
    "no-code",
    "",
  ];
  sufijosCSS.forEach((n) => {
    const href = `https://jeff-aporta.github.io/ResaltaProgJS/src/app/css/RP${s}${n}.css`;
    if (links.some((link) => link.href === href)) {
      return;
    }
    const link = document.createElement("link");
    const s = n ? "-" : "";
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });
})();
/*<-:*/
/*<-:*/

/*:->{"type": "title", "name": "Iniciación del módulo",  content: "Carga y declaración inicial del módulo.", huerotate: 8}*/
/*:->{"type": "note", "name": "Quema global de funciones características", 
content: "Este módulo no exporta funciones, pero las quema en el proyecto"}*/
window["ResaltaProg"] = ResaltaProg;
window["ResaltaProgEXEC"] = ResaltaProgEXEC;
/*<-:*/

/*:->{"type": "note", "name": "Variables de control", content: "Variables arbitrarias para controlar el sistema general."}*/
const classMain = "ResaltaProg";
const lenguajes = [lang_js];
const tabspaces = 4;
/*<-:*/

/*:->{"type": "note", "name": "Autoejecución", content: "Se descarta que iniciando hayan estructuras que solicitan resaltado de sintaxis."}*/
setTimeout(ResaltaProgEXEC);
/*<-:*/
/*<-:*/

/*:->{"type": "title", "name": "Funciones características", 
content: "Conjunto de funciones que se queman de forma global y particularizan el módulo"}*/
function ResaltaProgEXEC() {
  /*:->{"type": "note", "name": "Barrido y ejecución del resaltado"}*/
  document.querySelectorAll(`.${classMain}`).forEach(async (block) => {
    const lng = ([...block.classList].find((c) => c.startsWith("lang-")) ?? "lang-js").replace("lang-", "");

    let contenido = await (async () => {
      const url = block.dataset.ref;
      if (!url) {
        return block.innerText;
      }
      const exist = UrlExists(url);
      if (!exist) {
        return "Error, no se puede acceder al archive";
      }
      try {
        var text = await (await fetch(url)).text();
        return text;
      } catch (e) {
        return;
      }

      function UrlExists(url) {
        try {
          var http = new XMLHttpRequest();
          http.open("HEAD", url, false);
          http.send();
          return http.status != 404;
        } catch (e) {
          return false;
        }
      }
    })();

    const model = (() => {
      const retorno = lenguajes.find((l) => {
        if (typeof l.name == "string") {
          return l.name == lng;
        }
        return l.name.includes(lng);
      });
      return retorno ?? lang_js;
    })();

    if (model.preparar) {
      const autocollapse = block.classList.contains("autocollapse");
      contenido = model.preparar({
        string: contenido,
        tabspaces,
        autocollapse,
      });
    }

    contenido = cmds({
      input: contenido,
      transform: (str) => {
        return ResaltaProg({ string: str, model });
      },
    });

    block.innerHTML = contenido.string;
  });
  /*<-:*/
}

function ResaltaProg({ string, model, mask }) {
  /*:->{"type": "note", "name": "Evaluación de reglas del modelo"}*/
  if (!mask && model.mask) { //:-> No hubo mascara calculada previamente, y el modelo lo requiere, se procede a 
    mask = model.mask(string);
  }

  /*:->{"type": "note", "name": "Retorno", content: "procesamiento directo por el modelo", huerotate: 6}*/
  if (Array.isArray(string)) {
    //:-> La entrada ha sido fragmentada en un proceso anterior.
    return string.map((s) => {
      return ResaltaProg({ string: s, model, mask });
    });
  }
  /*<-:*/

  const frg = fragmentar({ string, mask });

  /*:->{"type": "note", "name": "Retorno", content: "No hubo fragmentación, es texto plano.", huerotate: 6}*/
  if (typeof frg == "string") {
    return frg;
  }
  /*<-:*/

  /*:->{"type": "note", "name": "Retorno", content: "Hubo fragmentación, es código formateado.", huerotate: 6}*/
  return frg
    .map((f) => {
      if (typeof f == "string") {
        return f;
      }
      return f.rule.apply(f);
    })
    .join("");
  /*<-:*/

  function fragmentar({ string, mask }) {
    if (typeof string != "string" || !string.trim()) {
      return string;
    }
    for (let rule of model.rules) {
      if (!rule.regex && !rule.regexmask) {
        continue;
      }
      let r = rule.regexmask && mask ? rule.regexmask : rule.regex;
      if (!Array.isArray(r)) {
        r = [r];
      }
      for (const regex of r) {
        const match = Array.from(
          (rule.regexmask && mask ? mask : string).matchAll(regex)
        )[0];

        if (match) {
          const start = match.index;
          const end = start + match[0].length;
          const [substr, submsk] = [string, mask]
            .filter(Boolean)
            .map((s) => s.substring(start, end));
          const [substrstart, submskstart] = [string, mask]
            .filter(Boolean)
            .map((s) => s.substring(0, start));
          const [substrend, submskend] = [string, mask]
            .filter(Boolean)
            .map((s) => s.substring(end));

          const fragsubstrstart = fragmentar({
            string: substrstart,
            mask: submskstart,
          });
          const fragsubstrend = fragmentar({
            string: substrend,
            mask: submskend,
          });

          return [
            ...(() => {
              if (typeof fragsubstrstart == "string") {
                return [fragsubstrstart];
              }
              return fragsubstrstart;
            })(),
            {
              rule,
              substr,
              submsk,
              start,
              end,
              strparent: string,
            },
            ...(() => {
              if (typeof fragsubstrend == "string") {
                return [fragsubstrend];
              }
              return fragsubstrend;
            })(),
          ];
        }
      }
    }
    return string;
  }
  /*<-:*/
}
/*<-:*/
