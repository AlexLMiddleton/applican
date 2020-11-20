import { createMuiTheme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[900]
    },
    secondary: {
      main: blue[500]
    }
  },
  shape: {
    borderRadius: 0
  }
});

export default theme;
