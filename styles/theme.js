import { ThemeProvider, createTheme } from '@mui/material/styles';
import { themeOptions } from './themeConfig';
export const theme = createTheme(themeOptions);
export default ThemeProvider;
