<?php

namespace App\Http\Controllers;

use App\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public static function search(Request $request)
    {
// dd($request->method());
if ($request->isMethod('get'))
{
    
return view('search',['query'=>$request->q]);
}


// dd($request->input('order.0.column'));
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
        $order = $request->input('order.0.column');
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
                $nestedData['images'] = json_decode($post->images);
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
