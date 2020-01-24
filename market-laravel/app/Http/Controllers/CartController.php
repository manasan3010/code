<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Products;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use function PHPSTORM_META\type;

// require __DIR__ . '/vendor/autoload.php';
//1. Import the PayPal SDK client that was created in `Set up Server-Side SDK`.
use App\PayPalClient;
use Exception;
use PayPalCheckoutSdk\Orders\OrdersGetRequest;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;



class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => '']);
    }



    public function getCheckoutPage()
    {   
        // dd(json_decode(Auth::User()->billingInfo, true));
        if (!Auth::User()) return;
        $info = DB::table('billing')->where('userId', Auth::User()->id)->first() ? DB::table('billing')->where('userId', Auth::User()->id)->first() : [];

        $info = json_decode(json_encode($info), true);

        return view('checkout')->with('info', $info)->with('cart', json_decode(Auth::User()->cart, true))->with('checkoutpage', true);
    }

    public function getCartPage()
    {
        $cart = json_decode(Auth::User()->cart, true);
        // dd($cart);
        return view('cart', compact('cart'));
    }

    public function getCart()
    {
        return view('contact');
    }

    public function getCartTotal($userId, $currency = null)
    {
        $sum = 0;

        foreach (json_decode(User::find($userId)->cart, true) as $key => $value) {
            $sum += $value * Products::find($key)->price;
        }

        if ($currency == 'USD') return bcdiv($sum, 181.24, 2);
        return $sum;
    }

    public function addItem(Request $request)
    {
        // return $request->input('id');
        $item = $request;
        $cart = json_decode(Auth::User()->cart, true);
        $item->id = intval($item->id);
        $item->quantity = intval($item->quantity);

        if (Products::find($item->id)) {
            $cart[$item->id] = $item->quantity;
            if ($item->quantity < 1) unset($cart[$item->id]);


            Auth::User()->cart = json_encode($cart);
            Auth::User()->save();
            return 1;
        }
        return abort(422);
        return $request;
        return var_dump($_POST);
    }

    public function deleteItem()
    {
        return view('contact');
    }

    public function checkout(Request $request)
    {
        // return $request;

        $validator = Validator::make($request->all(), [
            'addr1' => 'required|string',
            'addr2' => 'nullable|string',
            'companyName' => 'nullable|string',
            'country' => 'nullable|string',
            'fName' => 'required|string',
            'faxNo' => 'nullable|string',
            'lName' => 'nullable|string',
            'mName' => 'nullable|string',
            'message' => 'nullable|string',
            'mobileNo' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'title' => 'nullable|string',
            'zip' => 'nullable|string',

        ]);


        if ($validator->fails()) {
            return ['state' => 0, 'error' => $validator->messages()->first()];
        }


        DB::table('billing')
            ->updateOrInsert(
                ['userId' => Auth::User()->id],
                [
                    'addr1' => $request->addr1,
                    'addr2' => $request->addr2,
                    'companyName' => $request->companyName,
                    'country' => $request->country,
                    'fName' => $request->fName,
                    'faxNo' => $request->faxNo,
                    'lName' => $request->lName,
                    'mName' => $request->mName,
                    'message' => $request->message,
                    'mobileNo' => $request->mobileNo,
                    'state' => $request->state,
                    'city' => $request->city,
                    'title' => $request->title,
                    'zip' => $request->zip,
                ]
            );


        return ['state' => 1, 'conversionRate' => 181.24, 'sha256' => hash('sha256', 181.24 . 'secretStringForHash')];
    }

    public function purchase(Request $request)
    {
        // return $request;
        // $json = json_decode(file_get_contents('http://data.fixer.io/api/latest?access_key=c5b1e921ee09a518aa47ddf0258407f0&symbols=USD,LKR&format=1'), true);

        // if (hash('sha256', $request->conversionRate . 'secretStringForHash') !== $request->sha256) return 'hash';


        $orderId = $request->orderId;
        // 3. Call PayPal to get the transaction details
        $client = PayPalClient::client();
        try {
            $response = $client->execute(new OrdersGetRequest($orderId));
            /**
             *Enable the following line to print complete response as JSON.
             */
            //print json_encode($response->result);
            // print "Status Code: {$response->statusCode}\n";
            // print "Status: {$response->result->status}\n";
            // print "Order ID: {$response->result->id}\n";
            // print "Intent: {$response->result->intent}\n";
            // print "Links:\n";
            // foreach ($response->result->links as $link) {
            // print "\t{$link->rel}: {$link->href}\tCall Type: {$link->method}\n";
            // }

            // print "Gross Amount: {$response->result->purchase_units[0]->amount->currency_code} {$response->result->purchase_units[0]->amount->value}\n";
        } catch (Exception  $e) {
            return 'excep';
        }
        // dd($response->result);


        // To print the whole response body, uncomment the following line
        // echo json_encode($response->result, JSON_PRETTY_PRINT);


        // $total = $this->getCartTotal(Auth::User()->id);
        // if ($response->result->purchase_units[0]->amount->value != bcdiv($total, $request->conversionRate, 2)) return 'bcdiv';

        if ($response->result->purchase_units[0]->amount->value != $this->getCartTotal(Auth::User()->id, 'USD')) return 'bcdiv';

        DB::table('transactions')
            ->insert(
                [
                    'userId' => Auth::User()->id,
                    'billingId' => DB::table('billing')->where('userId', Auth::User()->id)->first()->id,
                    'cart' => Auth::User()->cart,
                    'total' => $this->getCartTotal(Auth::User()->id),
                    'created_at' => date("Y-m-d") . ' ' . date("H:i:s"),
                ]
            );




        return ["state" => 1];
    }

    public function createTransaction($debug = false)
    {
        $request = new OrdersCreateRequest();
        $request->prefer('return=representation');
        $request->body = self::buildRequestBody();
        // 3. Call PayPal to set up a transaction
        $client = PayPalClient::client();
        $response = $client->execute($request);
        if ($debug) {
            print "Status Code: {$response->statusCode}\n";
            print "Status: {$response->result->status}\n";
            print "Order ID: {$response->result->id}\n";
            print "Intent: {$response->result->intent}\n";
            print "Links:\n";
            foreach ($response->result->links as $link) {
                print "\t{$link->rel}: {$link->href}\tCall Type: {$link->method}\n";
            }

            // To print the whole responseac body, uncomment the following line
            // echo json_encode($response->result, JSON_PRETTY_PRINT);
        }

        // 4. Return a successful response to the client.
        return json_encode($response);
    }

    private static function buildRequestBody()
    {
        $billingInfo = DB::table('billing')->where('userId', Auth::User()->id)->first();
        
        // dd((new CartController)->getCartTotal(Auth::User()->id,));
        return array(
            'intent' => 'CAPTURE',
            'application_context' =>
            array(
                'brand_name' => 'E-Market',
                'locale' => 'en-US',
                'landing_page' => 'LOGIN',
                'shipping_preferences' => 'SET_PROVIDED_ADDRESS',
                'user_action' => 'PAY_NOW',
            ),
            'purchase_units' =>
            array(
                0 =>
                array(
                    'reference_id' => 'BILL_' . $billingInfo->id,
                    'description' => Auth::User()->cart,
                    'custom_id' => 'CUST_' . Auth::User()->id,
                    'soft_descriptor' => 'HighFashions',
                    'amount' =>
                    array(
                        'currency_code' => 'USD',
                        'value' => (new CartController)->getCartTotal(Auth::User()->id, 'USD'),
                        'breakdown' =>
                        array(
                            'item_total' =>
                            array(
                                'currency_code' => 'USD',
                                'value' => (new CartController)->getCartTotal(Auth::User()->id, 'USD'),
                            ),
                            'shipping' =>
                            array(
                                'currency_code' => 'USD',
                                'value' => '0.00',
                            ),
                            'handling' =>
                            array(
                                'currency_code' => 'USD',
                                'value' => '0.00',
                            ),
                            'tax_total' =>
                            array(
                                'currency_code' => 'USD',
                                'value' => '0.00',
                            ),
                            'shipping_discount' =>
                            array(
                                'currency_code' => 'USD',
                                'value' => '0.00',
                            ),
                        ),
                    ),
                    // 'items' =>
                    // array(
                    //     0 =>
                    //     array(
                    //         'name' => 'T-Shirt',
                    //         'description' => 'Green XL',
                    //         'sku' => 'sku01',
                    //         'unit_amount' =>
                    //         array(
                    //             'currency_code' => 'USD',
                    //             'value' => '90.00',
                    //         ),
                    //         'tax' =>
                    //         array(
                    //             'currency_code' => 'USD',
                    //             'value' => '10.00',
                    //         ),
                    //         'quantity' => '1',
                    //         'category' => 'PHYSICAL_GOODS',
                    //     ),
                    //     1 =>
                    //     array(
                    //         'name' => 'Shoes',
                    //         'description' => 'Running, Size 10.5',
                    //         'sku' => 'sku02',
                    //         'unit_amount' =>
                    //         array(
                    //             'currency_code' => 'USD',
                    //             'value' => '45.00',
                    //         ),
                    //         'tax' =>
                    //         array(
                    //             'currency_code' => 'USD',
                    //             'value' => '5.00',
                    //         ),
                    //         'quantity' => '2',
                    //         'category' => 'PHYSICAL_GOODS',
                    //     ),
                    // ),
                    'shipping' =>
                    array(
                        'method' => 'Custom Transport',
                        'address' =>
                        array(
                            'address_line_1' => $billingInfo->addr1,
                            'address_line_2' => $billingInfo->addr2,
                            'admin_area_2' => $billingInfo->city,
                            'admin_area_1' => $billingInfo->state,
                            'postal_code' => $billingInfo->zip,
                            'country_code' => 'LK',

                            // 'address_line_1' => '121 Townsend St',
                            // 'address_line_2' => 'Floor 6',
                            // 'admin_area_2' => 'San Francisco',
                            // 'admin_area_1' => 'CA',
                            // 'postal_code' => '94107',
                            // 'country_code' => 'US',
                        ),
                    ),
                ),
            ),
        );
    }
}
