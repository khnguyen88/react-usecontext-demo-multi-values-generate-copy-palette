import React, { Component, useContext, useState, useEffect } from 'react';
import { render } from 'react-dom';
import tinycolor from 'tinycolor2';

const ThemeContext = React.createContext(null);

const Button = () => {
  const { colorParent, paletteParent } = React.useContext(ThemeContext);
  const [color, setColor] = colorParent;
  const [palette, setPalette] = paletteParent;

  useEffect(() => {
    console.info('Context changed:', color);
  }, [color]);

  const handleClick = () => {
    console.info('handleClick');
    setColor(color === 'blue' ? 'red' : 'blue');

    // ----------------------------------------------------------
    // -- ALTERNATIVE 1 ---

    let value = Math.floor(Math.random() * 255); //Fake color randomization
    let newPalette = new Palette([
      tinycolor(`rgb (${value}, 215, ${value}`), // Light Primary
      tinycolor(`rgb (230, ${value}, 230)`), // Accent #1
      tinycolor(`rgb (${value}, ${value}, 128)`), // Brand Color
      tinycolor(`rgb (${value}, 215, 25)`), // Accent #2
      tinycolor(`rgb (0, 120, ${value})`), // Dark Primary
    ]);

    let rngRGB = () => {
      return Math.floor(Math.random() * 255);
    };

    setPalette(newPalette); //Generating a new palette from scratch

    // ----------------------------------------------------------
    // -- ALTERNATIVE 2 ---

    // palette.colors[0] = tinycolor(`rgb (${value}, 215, ${value}`);

    //-----------------------------------------------------------
    // -- ALTERNATIVE 3 ---

    // palette.colors[0] = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);
    // palette.colors[1] = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);
    // palette.colors[2] = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);
    // palette.colors[3] = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);
    // palette.colors[4] = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);

    //-----------------------------------------------------------
    // -- ALTERNATIVE 4 ---

    // palette.colors[0] = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);
    // palette.colors[1] = tinycolor(palette.colors[0].complement().toHexString());

    // let tetradColor = palette.colors[0].tetrad().map((c) => {
    //   return c.toHexString();
    // });
    // palette.colors[2] = palette.colors[0].tetrad()[1];
    // palette.colors[3] = palette.colors[0].tetrad()[2];
    // palette.colors[4] = palette.colors[0].tetrad()[3];

    //-----------------------------------------------------------
    // -- ALTERNATIVE 5 ---

    let newColor = tinycolor(`rgb (${rngRGB()}, ${rngRGB()}, ${rngRGB()}`);

    let tetradColor2 = newColor.tetrad().map((c) => {
      return c.toRgbString();
    });

    let newColors = [
      newColor.toRgbString(),
      newColor.complement().spin(-30).toRgbString(),
      tetradColor2[1],
      tetradColor2[2],
      tetradColor2[3],
    ];

    let newPalette2 = new Palette(newColors);

    setPalette(newPalette2);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ backgroundColor: color, color: 'white' }}
    >
      Toggle Colors and Generate New Palette
    </button>
  );
};

const CopyButton = () => {
  const { colorParent, paletteParent } = React.useContext(ThemeContext);
  const [color, setColor] = colorParent;
  const [palette, setPalette] = paletteParent;

  let HEXStringCollection = JSON.stringify(
    palette.colors.map((c) => {
      return c.toHexString();
    })
  );

  const handleCopyClick = () => {
    navigator.clipboard.writeText(HEXStringCollection);
    alert(HEXStringCollection);
  };

  return (
    <button
      type="button"
      onClick={handleCopyClick}
      style={{ backgroundColor: color, color: 'white' }}
    >
      Copy Palette
    </button>
  );
};

const App = () => {
  const [color, setColor] = useState('blue');
  const [palette, setPalette] = useState(new Palette());

  // This can probably be it's own component
  // Defining the key is very important
  const palettePreviewer = palette.colors.map((c, key) => {
    return (
      <div
        key={key}
        style={{
          height: '2em',
          width: '12em',
          backgroundColor: c.toHexString(),
          color: 'blue',
        }}
      >
        {c.toHexString()}
      </div>
    );
  });

  // alert(JSON.stringify(palette));

  return (
    <ThemeContext.Provider
      value={{
        colorParent: [color, setColor],
        paletteParent: [palette, setPalette],
      }}
    >
      <h1>React Context Demo</h1>
      included:
      <ul>
        <li>createContext</li>
        <li>useContext</li>
        <li>share state via Provider</li>
        <li>change value in child component</li>
      </ul>
      <h3>
        Color in Parent: <span style={{ color: color }}>{color}</span>
      </h3>
      <h3>Palette in Parent:</h3>
      <div>
        <>{palettePreviewer}</>
      </div>
      <Button />
      <CopyButton />
    </ThemeContext.Provider>
  );
};

class Palette {
  colors = [];

  pairedColors = [];

  constructor(
    newPalette = [
      tinycolor('rgb (255, 255, 255)'), // Light Primary
      tinycolor('rgb (230, 230, 230)'), // Accent #1
      tinycolor('rgb (128, 128, 128)'), // Brand Color
      tinycolor('rgb (25, 25, 25)'), // Accent #2
      tinycolor('rgb (0, 0, 0)'), // Dark Primary
    ]
  ) {
    this.StorePalette(newPalette);
  }

  GeneratePalette() {}

  AdjustPalette() {}

  CopyPalette() {
    return;
  }

  StorePalette(newPalette) {
    if (newPalette.length > 0 && newPalette.length <= 5) {
      if (Array.isArray(newPalette[0]) && typeof newPalette[0][0] == 'number') {
        for (let i = 0; i < newPalette.length; i++) {
          this.colors.push(
            tinycolor(
              `rgb (${newPalette[i][0]}, ${newPalette[i][1]}, ${newPalette[i][2]})`
            )
          );
        }
      } else if (
        !Array.isArray(newPalette[0]) &&
        typeof newPalette[0] == 'string'
      ) {
        for (let i = 0; i < newPalette.length; i++) {
          this.colors.push(tinycolor(newPalette[i]));
        }
      } else {
        this.colors = newPalette;
      }
    }
  }

  UpdatePairedColors(colors) {}
}

class PairedColors {}

render(<App />, document.getElementById('root'));
