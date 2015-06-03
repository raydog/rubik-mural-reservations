package main

import (
	"image"
	"image/png"
	"image/color"
	"os"
	"fmt"
)

func main() {
	f, err := os.Open("./vungle.png")
	if err != nil {
		panic(err)
	}

	img, err := png.Decode(f)
	if err != nil {
		panic(err)
	}
	
	for y := 1 ; y<=10 ; y++ {
		for x := 1 ; x<=20 ; x++ {
			
			outpic := image.NewRGBA(image.Rect(0,0,3,3))

			for xi := 0 ; xi < 3 ; xi++ {
				for yi := 0 ; yi < 3 ; yi++ {
					_, _, _, alpha := img.At((x-1)*3+xi, (y-1)*3+yi).RGBA()
					if alpha > 32000 {
						outpic.Set(xi, yi, color.Black)
					}
				}
			}

			// Write the png:
			fname := fmt.Sprintf("cube_%d_%d.png", x, y)
			outfile, err := os.Create(fname)
			if err != nil {
				panic(err)
			}
			err = png.Encode(outfile, outpic)
			if err != nil {
				panic(err)
			}
		}
	}
}
