<?php

namespace App\Http\Controllers;

use App\Products;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin', ['except' => '']);
    }

    public function getHome()
    {
        return view('admin.home');
    }

    public function getAddProduct()
    {
        return view('admin.addProduct');
    }

    public function addProduct(Request $request)
    {
        // return abort(404);


        $filePath = [];
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:500',
            'price' => 'required',
            'image_files.*' => 'file|mimes:jpg,jpeg,png,gif,bmp,pdf,doc,docx,txt'

        ]);

        if ($request->category == null) {
            $request->category = [];
        }

        if ($validator->fails()) {
            return ['state' => 0, 'error' => $validator->messages()->first()];


            Session::flash('error', $validator->messages()->first());
            return redirect()->back()->withInput();
        }

        if ($request->hasFile('image_files')) {
            foreach ($request->file('image_files') as $file) {

                // $photo = new Photo;

                // name it differently by time and count
                $fileName = date('d-m-y') . "_" . bin2hex(random_bytes(5)) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('image_files', $fileName);
                array_push($filePath, $fileName);
                // move the file to desired folder
                // $file->move('folderName/', $fileName);

                // assign the location of folder to the model
                // $photo->image = 'folderName/' . $fileName;

                //  $photo->status = 1;
                // $photo->save();
            }
        }

        $category = [];
        foreach ($request->category as $key) {
            $category[$key] = true;
        }

        // $data = request()->validate([
        //     'name' => 'required',
        //     'image_files' => ['image'],
        //     'price' => 'required',
        // ]);
        if ($request->id == null) {
            $data = Products::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'current_stock' => $request->current_stock,
                'availability' => $request->availability,
                'location' => $request->location,
                'brand' => $request->brand,
                'rating' => $request->rating,
                'tags' => $request->tags,
                'images' => json_encode($filePath),
            ]);

            $category['product_id'] = $data->id;
            DB::table('categories')->insert($category);
        } elseif ($filePath) {
            foreach (json_decode(Products::find($request->id)->images, true) as $oldImage) {

                if (file_exists(storage_path('app/public/image_files/' . $oldImage))) unlink(storage_path('app/public/image_files/' . $oldImage));
            }

            Products::whereId($request->id)->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'current_stock' => $request->current_stock,
                'availability' => $request->availability,
                'location' => $request->location,
                'brand' => $request->brand,
                'images' => json_encode($filePath),
            ]);

            // $category['product_id'] = $request->id;
            DB::table('categories')->updateOrInsert(['product_id' => $request->id], $category);
        } else {

            Products::whereId($request->id)->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'current_stock' => $request->current_stock,
                'availability' => $request->availability,
                'location' => $request->location,
                'brand' => $request->brand,
            ]);

            // $category['product_id'] = $request->id;
            // dd($request->id);

            DB::table('categories')->updateOrInsert(['product_id' => $request->id], $category);
        }



        return ['state' => 1];
        // return $request;
    }

    public function deleteProduct(Request $request)
    {
        if (!Products::whereId($request->id)->first()) return ['state' => 0, 'error' => 'Record Not Found'];

        Products::whereId($request->id)->delete();
        return ['state' => 2];
    }

    public function getEditProduct()
    {
        return view('admin.editProduct');
    }

    public function getProductInfo(Request $request)
    {
        // $a = Products::all();
        // $a[0]->name =   $request->input('start');
        // return $a;


        $columns = [
            'id',
            'name',
            'price',
            'availability',
            'current_stock',
            'brand',
            'location',
            'description',
            'created_at',
            'updated_at',
        ];

        $totalData = Products::count();

        $totalFiltered = $totalData;

        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')];
        $dir = $request->input('order.0.dir');

        if (empty($request->input('search.value'))) {
            $posts = Products::offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search = $request->input('search.value');

            $posts =  Products::where('id', 'LIKE', "%{$search}%")
                ->orWhere('name', 'LIKE', "%{$search}%")
                ->orWhere('price', 'LIKE', "%{$search}%")
                ->orWhere('availability', 'LIKE', "%{$search}%")
                ->orWhere('current_stock', 'LIKE', "%{$search}%")
                ->orWhere('brand', 'LIKE', "%{$search}%")
                ->orWhere('location', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('created_at', 'LIKE', "%{$search}%")
                ->orWhere('updated_at', 'LIKE', "%{$search}%")
                // ->orWhere('category', 'LIKE', "%{$search}%")
                ->orWhere('tags', 'LIKE', "%{$search}%")

                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();

            $totalFiltered = Products::where('id', 'LIKE', "%{$search}%")
                ->orWhere('name', 'LIKE', "%{$search}%")
                ->orWhere('price', 'LIKE', "%{$search}%")
                ->orWhere('availability', 'LIKE', "%{$search}%")
                ->orWhere('current_stock', 'LIKE', "%{$search}%")
                ->orWhere('brand', 'LIKE', "%{$search}%")
                ->orWhere('location', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('created_at', 'LIKE', "%{$search}%")
                ->orWhere('updated_at', 'LIKE', "%{$search}%")
                // ->orWhere('category', 'LIKE', "%{$search}%")
                ->orWhere('tags', 'LIKE', "%{$search}%")

                ->count();
        }

        $data = array();
        if (!empty($posts)) {
            foreach ($posts as $post) {
                // $show =  route('posts.show', $post->id);
                // $edit =  route('posts.edit', $post->id);
                $categoryArray = [];
                $categoryTable = DB::table('categories')->where('product_id', $post->id)->first() ? DB::table('categories')->where('product_id', $post->id)->first() : [];


                foreach ($categoryTable as $key => $value) {
                    if ($value && $key != 'product_id') {
                        array_push($categoryArray, $key);
                    }
                }
                // dd($categoryArray);

                $nestedData['id'] = $post->id;
                $nestedData['name'] = $post->name;
                $nestedData['price'] = $post->price;
                $nestedData['availability'] = $post->availability;
                $nestedData['current_stock'] = $post->current_stock;
                $nestedData['brand'] = $post->brand;
                $nestedData['location'] = $post->location;
                $nestedData['category'] = $categoryArray;
                $nestedData['tags'] = $post->tags;
                $nestedData['images'] = $post->location;
                $nestedData['description'] = (strlen($post->description) > 50) ? substr(strip_tags($post->description), 0, 50) . "..." : $post->description;
                $nestedData['description'] = $post->description;
                $nestedData['created_at'] = date('j M Y h:i a', strtotime($post->created_at));
                $nestedData['updated_at'] = date('j M Y h:i a', strtotime($post->updated_at));

                $data[] = $nestedData;
            }
        }

        $json_data = array(
            "draw"            => intval($request->input('draw')),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $data
        );

        return $json_data;
        // echo json_encode($json_data);
    }
}
