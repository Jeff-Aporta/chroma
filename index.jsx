const execAppPrev = Boolean(
  new URLSearchParams(window.location.search).get("url")
);

if (execAppPrev) {
  appPrev();
} else {
  AppDoc();
}

function appPrev() {
  ReactDOM.render(<App />, document.querySelector("body"));
  setTimeout(ResaltaProgEXEC);
  document.body.scrollTop = 0;

  function App() {
    const urlParam = unescape(getParam({
      name: "url",
      required: { message: "URL del archivo" },
    }));
    const autocollapse = (() => {
      const r =
        getParam({
          name: "autocollapse",
          def: true,
        }) == "true";
      return r ? "autocollapse" : "";
    })();
    const lng = (() => {
      const l = getParam({
        name: "lang",
        def: urlParam.split(".").pop(),
      });
      return `lang-${l}`;
    })();
    const nobg = (() => {
      const r =
        getParam({
          name: "nobg",
          def: false,
        }) == "true";
      return r ? "nobg" : "";
    })();
    const theme = getParam({
      name: "theme",
      def: "nightblue",
    });
    const retorno = (
      <div
        className={`ResaltaProg ${theme}`}
        style={{
          display: "block",
          minWidth: "max-content",
          margin: 0,
          padding: 0,
          fontFamily: "Roboto, sans-serif, Arial, Helvetica",
          fontWeight: 500,
          padding: "0 10px 130px 10px",
        }}
      >
        <style>{`
            @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

            html,body{
                margin: 0;
                padding: 0;
                background-color: transparent;
                min-height: 100vh;
            }
            pre{
                font-family: inherit;
                padding: 0 !important;
                margin: 0 !important;
                width: 100%;
                min-height: 95vh;
                min-width: 95vw !important;
            }
            body {
                font-size: 14px;
                display: flex;
                flex-direction: column;
            }
        `}</style>
        <div
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            paddingTop: "25px",
            color: "rgba(200, 0, 255)",
            textAlign: "center",
            width: "97dvw",
            position: "sticky",
            left: "10px",
          }}
        >
          {urlParam}
          <br />
          <br />
          <hr style={{ opacity: 0.2 }} />
          <br />
        </div>
        <div style={{ padding: "10px 0", width: "max-content", margin: "auto" }}>
          <pre
            className={`ResaltaProg ${lng} ${nobg} ${autocollapse} ${theme}`}
            data-ref={urlParam}
          >
            <style>{`
                .lds-dual-ring {
                    color: white;
                }
                .lds-dual-ring,
                .lds-dual-ring:after {
                    box-sizing: border-box;
                }
                .lds-dual-ring {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                }
                .lds-dual-ring:after {
                    content: " ";
                    display: block;
                    width: 64px;
                    height: 64px;
                    margin: 8px;
                    border-radius: 50%;
                    border: 6.4px solid currentColor;
                    border-color: currentColor transparent currentColor transparent;
                    animation: lds-dual-ring 1.2s linear infinite;
                }
                @keyframes lds-dual-ring {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
            <div
              style={{
                minHeight: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <div class="lds-dual-ring"></div>
            </div>
          </pre>
        </div>
      </div>
    );
    return retorno;

    function getParam({ name, required, def }) {
      const urlParams = new URLSearchParams(window.location.search);
      let urlParam = urlParams.get(name) ?? def;
      if (required) {
        while (!urlParam) {
          urlParam = prompt(required.message);
        }
      }
      setURL();
      return urlParam;

      function setURL() {
        const url = new URL(window.location.href);
        url.searchParams.set(name, urlParam);
        window.history.pushState({}, "", url);
      }
    }
  }
}

function AppDoc() {
  ReactDOM.render(
    <div className="esquema-principal">
      <div className="contenedor-pagina">
        <EnvolventePagina>
          {esquemaGeneralLibreria(_RESALTA_PROG_)}
        </EnvolventePagina>
        <BotonLinkPortafolio />
      </div>
    </div>,
    document.querySelector("body")
  );
}
