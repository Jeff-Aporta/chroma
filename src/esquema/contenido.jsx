const _RESALTA_PROG_ = new GenerarContenidoLibreria({
  nombre: "Resalta Prog JS",
  slogan: "Sintax-highlighter, resalta y documenta código",
  img: "src/img/logo.jpeg",

  github: "https://github.com/Jeff-Aporta/ResaltaProgJS",

  resumen: {
    desc: `
            *Resalta Prog JS* es una librería que permite resaltar la sintaxis de un código fuente,
            además de ayudar a documentar el código.
        `,
    descImg: [
      "Permite de forma sencilla actualizar el resaltado texto de elementos ejecutando una función",
      "Añade herramientas de documentación para mostrar información de manera ordenada y compacta",
      "Personaliza desde CSS los colores y estilos de los elementos",
    ],
  },

  secciones: [
    {
      nombre: "Usar con CDN",
      contenido: (thisObj) => {
        return (
          <FormatoDoc>
            <p>
              Para usar <b>ResaltaProg JS</b> en un proyecto web, se debe
              agregar el siguiente script.
              <br />
              <br />
              Se puede usar el siguiente enlace para cargar el script.
            </p>
            <Code nocode className="link">
              {thisObj.githubPage}/index.mjs
            </Code>
          </FormatoDoc>
        );
      },
    },
    {
      nombre: "API APP",
      contenido: (thisObj) => {
        const opnslangs = [{ label: "JavaScript" }];
        const opnsTheme = [
          { label: "Night" },
          { label: "Nightblue" },
          { label: "light" },
        ];
        const langid = {
          JavaScript: "js",
        };
        return (
          <FormatoDoc>
            Puedes usar la API APP para visualizar y procesar cualquier archivo en la web.
            <h2>Procesa y visualiza un archivo</h2>
            <br />
            Inserta texto de código y observa el resultado.
            <br />
            <br />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>
              <TextField
                className="url-archivo"
                label="URL código"
                variant="outlined"
                fullWidth
                onChange={actualizarResultAPIAPP}
              />
              <Autocomplete
                id="combo-box-lang"
                disablePortal
                options={opnslangs}
                sx={{ width: "48%", display: "inline-block" }}
                renderInput={(params) => (
                  <TextField {...params} label="Lenguaje" />
                )}
                onChange={actualizarResultAPIAPP}
              />
              <Autocomplete
                id="combo-box-theme"
                disablePortal
                options={opnsTheme}
                sx={{ width: "48%", display: "inline-block" }}
                onChange={(event, newValue) => {
                  setThemeSelect(opnsTheme.find((x) => x === newValue));
                  actualizarResultAPIAPP();
                }}
                renderInput={(params) => <TextField {...params} label="Tema" />}
              />
              <FormControlLabel
                control={
                  <Checkbox defaultChecked className="chk-autocollapse" />
                }
                label="Autocollapsed"
                onChange={actualizarResultAPIAPP}
              />
              <FormControlLabel
                control={
                  <Checkbox defaultChecked={false} className="chk-nobg" />
                }
                label="No background"
                onChange={actualizarResultAPIAPP}
              />
              <br />
              <div
                className="result-API-APP-container"
                style={{ display: "none", width: "100%" }}
              >
                <h2>URL para usar</h2>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    justifyContent: "start",
                    padding: "10px 10px",
                  }}
                >
                  <div
                    style={{
                      width: "calc(100% - 100px)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      color: "dodgerblue",
                    }}
                  >
                    <Link
                      href=""
                      className="result-API-APP"
                      target="_blank"
                      style={{
                        whiteSpace: "nowrap",
                        color: "inherit",
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      Navigator.clipboard.writeText(
                        document
                          .querySelector(".result-API-APP")
                          .getAttribute("href")
                      );
                    }}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "90%",
                      color: "white",
                    }}
                    startIcon={<i className="fa fa-copy" />}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          </FormatoDoc>
        );

        function actualizarResultAPIAPP() {
          const urlArchivo = document.querySelector(".url-archivo input").value;
          if (!urlArchivo) {
            document.querySelector(".result-API-APP-container").style.display =
              "none";
            return;
          }
          document.querySelector(".result-API-APP-container").style.display =
            "block";
          const lang = langid[document.querySelector("#combo-box-lang").value];
          const theme = opnsTheme.find(
            (o) => o === document.querySelector("#combo-box-theme").value
          );
          const autocollapse = document.querySelector(
            ".chk-autocollapse input"
          ).checked;
          const nobg = document.querySelector(".chk-nobg input").checked;
          const newURL = (() => {
            // const url = new URL("https://jeff-aporta.github.io/ResaltaProgJS/");
            const url = new URL(window.location.href);
            const params = (() => {
              const r = new URLSearchParams();
              r.append("url", escape(urlArchivo));
              if (lang) {
                r.append("lang", escape(lang));
              }
              if (theme) {
                r.append("theme", escape(theme));
              }
              if (autocollapse) {
                r.append("autocollapse", escape(autocollapse));
              }
              if (nobg) {
                r.append("nobg", escape(nobg));
              }
              return r;
            })();
            url.search = params.toString();
            return url.toString();
          })();
          const resultAPIAPP = document.querySelector(".result-API-APP");
          resultAPIAPP.href = newURL;
          resultAPIAPP.innerHTML = newURL;
        }
      },
    },
  ],
});
