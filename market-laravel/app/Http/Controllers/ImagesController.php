<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImagesController extends Controller
{
    public function getImage($image, Request $request)
    {
        // dd();
        if (!file_exists(public_path('images/' . $image)) || $request->q == null) {
            die('Unable to process the requested file.');
        }
        // $height = $request->h;
        $qulaity = $request->q;
        $ext = explode('.', $image)[array_key_last(explode('.', $image))];
        $file = public_path('images/' . $image);
        $newFile = public_path('images/_thump/' . $image . '_' . $qulaity);
        // $image  = $_GET['img'];
        // dd($newFile, $file);
        list($width, $height)  = ($request->w && $request->h) ? [intval($request->w), intval($request->h)] : getimagesize($file);
        // dd($width, $height);

        // Check if file exists

        ob_end_clean();
        header('Content-Type: image/' . $ext);


        // Check if a thumb already exists, otherwise create a thumb
        if (file_exists($newFile)) {
            return readfile($newFile);
        } else {
            // $img = new imagick(public_path('images/' . $image));
            // $img->setImageFormat($ext);
            // $img->scaleImage($width, 0);
            // $img->cropImage($width, $height, 0, 0);
            // $img->writeImage(public_path('images/_thump/' . $image));

            switch ($ext) {
                case "png":
                    imagepng(imagescale(imagecreatefrompng($file), $width, $height), $newFile, $qulaity);
                    break;
                case "gif":
                    imagegif(imagescale(imagecreatefromgif($file), $width, $height), $newFile, $qulaity);
                    break;
                case "bmp":
                    imagebmp(imagescale(imagecreatefrombmp($file), $width, $height), $newFile, $qulaity);
                    break;
                case "webp":
                    imagewebp(imagescale(imagecreatefromwebp($file), $width, $height), $newFile, $qulaity);
                    break;
                default:
                    imagejpeg(imagescale(imagecreatefromjpeg($file), $width, $height), $newFile, $qulaity);
                    break;
            }


            return readfile($newFile);
        }
    }
}
