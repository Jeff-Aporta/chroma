const opnslangs = [{ label: "JavaScript" }];
const langid = {
  JavaScript: "js",
};

let clasePre = "lang-js";
let procesoDisable = true;

let textInputSrc;
let urlInputSrc;
let srcCode;

ReactDOM.render(
  <ThemeProvider theme={themeSelected}>
    <div className="esquema-principal">
      <div className="contenedor-pagina">
        <Paper
          elevation={1}
          style={{
            padding: "20px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            startIcon={<i className="fa fa-code" />}
            href="/"
            size="large"
            style={{
              color: "white",
            }}
          >
            Documentación
          </Button>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "150%",
              color: "slategray",
            }}
          >
            ResaltaProg.JS
            <img
              src="/src/img/logo.jpeg"
              alt="Logo"
              width="50"
              height="50"
              style={{ borderRadius: "50%" }}
            />
          </a>
        </Paper>
        <EnvolventePagina>
          <div style={{ minHeight: "100vh" }}>
            <App />
          </div>
        </EnvolventePagina>
      </div>
    </div>
  </ThemeProvider>,
  document.querySelector("body")
);

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [valueIndexTab, setValueIndexTab] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [textDialog, setTextDialog] = React.useState("");
  const [lngSelect, setLngSelect] = React.useState(opnslangs[0]);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <React.Fragment>
      <BasicTabs />
      <ResponsiveDialog />
    </React.Fragment>
  );

  function ResponsiveDialog() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClose = () => {
      setOpenDialog(false);
    };

    return (
      <React.Fragment>
        <Dialog
          fullScreen={fullScreen}
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            No hay entrada.
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{textDialog || "Error"}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  function BasicTabs() {
    const handleChange = (event, newValue) => {
      setValueIndexTab(newValue);
      procesoDisable = true;
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={valueIndexTab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Fuente" {...a11yProps(0)} />
            <Tab
              label="Procesado"
              {...a11yProps(1)}
              disabled={procesoDisable}
              style={{ display: procesoDisable ? "none" : "block" }}
            />
          </Tabs>
        </Box>
        <br />

        <CustomTabPanel value={valueIndexTab} index={0}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Autocomplete
              id="combo-box"
              disablePortal
              options={opnslangs}
              sx={{ width: 300, display: "inline-block" }}
              onChange={(event, newValue) => {
                setLngSelect(opnslangs.find((x) => x === newValue));
              }}
              defaultValue={lngSelect}
              renderInput={(params) => (
                <TextField {...params} label="Lenguaje" />
              )}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<i className="fa fa-play" />}
              onClick={() => {
                const lang = langid[document.querySelector("input").value];
                if (!lang) {
                  setTextDialog("No se ha seleccionado un lenguaje.");
                  return handleClickOpenDialog();
                }
                switch (srcCode) {
                  case "text":
                    if (!textInputSrc) {
                      setTextDialog("No hay texto de entrada.");
                      return handleClickOpenDialog();
                    }
                    break;
                  case "url":
                    if (!urlInputSrc) {
                      setTextDialog("No hay URL de entrada.");
                      return handleClickOpenDialog();
                    }
                    break;
                }
                clasePre = `lang-${lang}`;
                procesoDisable = false;
                setValueIndexTab(1);
                setTimeout(ResaltaProgEXEC);
              }}
            >
              Realizar: Resalta Prog
            </Button>
          </div>
          <br />
          <InputTextual />
        </CustomTabPanel>
        <CustomTabPanel value={valueIndexTab} index={1}>
          Resultado del procesamiento:
          <br />
          <div style={{ overflow: "auto", maxHeight: "90vh" }}>
            {(() => {
              switch (srcCode) {
                case "text":
                  return (
                    <pre className={`ResaltaProg ${clasePre}`}>
                      {textInputSrc}
                    </pre>
                  );
                case "url":
                  return (
                    <pre
                      className={`ResaltaProg ${clasePre}`}
                      data-ref={urlInputSrc}
                    />
                  );
              }
            })()}
          </div>
        </CustomTabPanel>
      </Box>
    );

    function InputTextual() {
      const [valueText, setValueText] = React.useState(textInputSrc ?? "");
      const [valueUrl, setValueUrl] = React.useState(urlInputSrc ?? "");
      const [valueSrc, setValueSrc] = React.useState(srcCode ?? "text");

      srcCode = valueSrc;
      textInputSrc = valueText;
      urlInputSrc = valueUrl;

      return (
        <React.Fragment>
          <FormControl>
            <RadioGroup
              defaultValue={valueSrc}
              name="src-code"
              onChange={() => setValueSrc(event.target.value)}
              row
            >
              <FormControlLabel
                value="text"
                control={<Radio />}
                label="Texto"
                sx={{ display: "inline-block" }}
              />
              <FormControlLabel
                value="url"
                control={<Radio />}
                label="URL"
                sx={{ display: "inline-block" }}
              />
            </RadioGroup>
          </FormControl>
          <br />
          {(() => {
            switch (valueSrc) {
              case "text":
                return (
                  <TextField
                    multiline
                    fullWidth
                    id="text-src"
                    label={valueText ? "" : "Ingresa el código fuente aquí"}
                    rows={20}
                    variant="filled"
                    defaultValue={valueText}
                    value={valueText}
                    onChange={(e) => setValueText(e.target.value)}
                  />
                );
              case "url":
                return (
                  <TextField
                    label={valueUrl ? "" : "URL"}
                    fullWidth
                    variant="filled"
                    defaultValue={valueUrl}
                    value={valueUrl}
                    onChange={(e) => setValueUrl(e.target.value)}
                  />
                );
            }
          })()}
          {(() => {
            switch (srcCode) {
              case "text":
                if (textInputSrc) {
                  return;
                }
                break;
              case "url":
                if (urlInputSrc) {
                  return;
                }
                break;
            }
            return (
              <React.Fragment>
                <br />
                <br />
                <br />
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    switch (srcCode) {
                      case "text":
                        setValueText(
                          `const x = 5;\n\nconsole.log(x.toString(36));\nconsole.log("Fin del programa");`
                        );
                        break;
                      case "url":
                        setValueUrl(
                          "https://jeff-aporta.github.io/ResaltaProgJS/langs/js.mjs"
                        );
                        break;
                    }
                  }}
                >
                  Ejemplo de prueba
                </Button>
              </React.Fragment>
            );
          })()}
        </React.Fragment>
      );
    }

    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    }
  }
}

setTimeout(() => {
  PR.prettyPrint();
}, 0);
