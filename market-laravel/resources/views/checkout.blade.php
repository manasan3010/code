@extends('layouts.app')

@section('content')

<style>
    .bill-to input {
        background: #F0F0E9;
        border: 0 none;
        margin-bottom: 10px;
        padding: 10px;
        width: 100%;
        font-weight: 400;
    }

    .bill-to select {
        height: 40px;
        margin-bottom: 10px;
    }
</style>


<section id="cart_items">
    <div class="container">
        <div class="breadcrumbs">
            <ol class="breadcrumb">
                <li><a href="#">Home</a></li>
                <li class="active">Check out</li>
            </ol>
        </div>
        <!--/breadcrums-->

        <div class="step-one">
            <h2 class="heading">Step1</h2>
        </div>
        <div class="checkout-options">
            @if(!Auth::User())
            <h3>New User</h3>
            @else
            <h3>Exisiting User</h3>
            @endif
            <p>Checkout options</p>
            <ul class="nav">
                @if(!Auth::User())
                <li style="margin-top: 0px;">
                    <label><input type="checkbox" name="new_option" disabled checked> Register And Procced</label>
                </li>
                <li style="margin-top: -4px;padding-bottom:14px;">
                    <!-- <label><input type="checkbox" name="new_option"> Guest Checkout</label> -->
                    <span>Already have an account?&nbsp;&nbsp;</span><button onclick="window.location.href = '/login' " style="margin-top: 0px;" class="btn btn-primary">Login</button>

                </li>
                @endif
                <li>
                    <a class="" style="margin-top: -4px;" href=""><i class="fa fa-times"></i>Cancel Checkout</a>
                </li>
            </ul>
        </div>
        <!--/checkout-options-->

        <div class="register-req"> @if(!Auth::User())
            <p>Please use Register And Checkout to easily get access to your order history, or use Checkout as Guest</p>@endif
        </div>
        <!--/register-req-->

        <div class="shopper-informations">
            <form action="" id="billForm">
                <div class="row">
                    @if(!Auth::User())
                    <div class="col-sm-3">
                        <div class="shopper-info">
                            <p>Shopper Information</p>
                            <form>
                                <input type="text" placeholder="Display Name">
                                <input type="text" placeholder="User Name">
                                <input type="password" placeholder="Password">
                                <input type="password" placeholder="Confirm password">
                            </form>
                            <a class="btn btn-primary" href="">Get Quotes</a>
                            <a class="btn btn-primary" href="">Continue</a>
                        </div>
                    </div>
                    @endif
                    <div class="col-sm-5 clearfix">
                        <div class="bill-to">
                            <p>Bill To </p>
                            <div class="form-one">
                                <input type="text" name="companyName" placeholder="Company Name" value='{{ $info["companyName"] ?? "" }}'>
                                <!-- <input type="text" placeholder="Email*"> -->
                                <input type="text" name="title" placeholder="Title" value='{{ $info["title"] ?? "" }}'>
                                <input type="text" required name="fName" placeholder="First Name *" value='{{ $info["fName"] ?? "" }}'>
                                <input type="text" name="mName" placeholder="Middle Name" value='{{ $info["mName"] ?? "" }}'>
                                <input type="text" name="lName" placeholder="Last Name" value='{{ $info["lName"] ?? "" }}'>
                                <input type="text" required name="addr1" placeholder="Address 1 *" value='{{ $info["addr1"] ?? "" }}'>
                                <input type="text" name="addr2" placeholder="Address 2" value='{{ $info["addr2"] ?? "" }}'>
                            </div>
                            <div class="form-two">
                                <input type="number" name="zip" placeholder="Zip / Postal Code" value='{{ $info["zip"] ?? "" }}'>
                                <select id="country" name="country" class="" style="">
                                    <option value="Afghanistan">Afghanistan</option>
                                    <option value="Åland Islands">Åland Islands</option>
                                    <option value="Albania">Albania</option>
                                    <option value="Algeria">Algeria</option>
                                    <option value="American Samoa">American Samoa</option>
                                    <option value="Andorra">Andorra</option>
                                    <option value="Angola">Angola</option>
                                    <option value="Anguilla">Anguilla</option>
                                    <option value="Antarctica">Antarctica</option>
                                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Armenia">Armenia</option>
                                    <option value="Aruba">Aruba</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Austria">Austria</option>
                                    <option value="Azerbaijan">Azerbaijan</option>
                                    <option value="Bahamas">Bahamas</option>
                                    <option value="Bahrain">Bahrain</option>
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="Barbados">Barbados</option>
                                    <option value="Belarus">Belarus</option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="Belize">Belize</option>
                                    <option value="Benin">Benin</option>
                                    <option value="Bermuda">Bermuda</option>
                                    <option value="Bhutan">Bhutan</option>
                                    <option value="Bolivia">Bolivia</option>
                                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                    <option value="Botswana">Botswana</option>
                                    <option value="Bouvet Island">Bouvet Island</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                    <option value="Brunei Darussalam">Brunei Darussalam</option>
                                    <option value="Bulgaria">Bulgaria</option>
                                    <option value="Burkina Faso">Burkina Faso</option>
                                    <option value="Burundi">Burundi</option>
                                    <option value="Cambodia">Cambodia</option>
                                    <option value="Cameroon">Cameroon</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Cape Verde">Cape Verde</option>
                                    <option value="Cayman Islands">Cayman Islands</option>
                                    <option value="Central African Republic">Central African Republic</option>
                                    <option value="Chad">Chad</option>
                                    <option value="Chile">Chile</option>
                                    <option value="China">China</option>
                                    <option value="Christmas Island">Christmas Island</option>
                                    <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="Comoros">Comoros</option>
                                    <option value="Congo">Congo</option>
                                    <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                    <option value="Cook Islands">Cook Islands</option>
                                    <option value="Costa Rica">Costa Rica</option>
                                    <option value="Cote D'ivoire">Cote D'ivoire</option>
                                    <option value="Croatia">Croatia</option>
                                    <option value="Cuba">Cuba</option>
                                    <option value="Cyprus">Cyprus</option>
                                    <option value="Czech Republic">Czech Republic</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Djibouti">Djibouti</option>
                                    <option value="Dominica">Dominica</option>
                                    <option value="Dominican Republic">Dominican Republic</option>
                                    <option value="Ecuador">Ecuador</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="El Salvador">El Salvador</option>
                                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                                    <option value="Eritrea">Eritrea</option>
                                    <option value="Estonia">Estonia</option>
                                    <option value="Ethiopia">Ethiopia</option>
                                    <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                    <option value="Faroe Islands">Faroe Islands</option>
                                    <option value="Fiji">Fiji</option>
                                    <option value="Finland">Finland</option>
                                    <option value="France">France</option>
                                    <option value="French Guiana">French Guiana</option>
                                    <option value="French Polynesia">French Polynesia</option>
                                    <option value="French Southern Territories">French Southern Territories</option>
                                    <option value="Gabon">Gabon</option>
                                    <option value="Gambia">Gambia</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Gibraltar">Gibraltar</option>
                                    <option value="Greece">Greece</option>
                                    <option value="Greenland">Greenland</option>
                                    <option value="Grenada">Grenada</option>
                                    <option value="Guadeloupe">Guadeloupe</option>
                                    <option value="Guam">Guam</option>
                                    <option value="Guatemala">Guatemala</option>
                                    <option value="Guernsey">Guernsey</option>
                                    <option value="Guinea">Guinea</option>
                                    <option value="Guinea-bissau">Guinea-bissau</option>
                                    <option value="Guyana">Guyana</option>
                                    <option value="Haiti">Haiti</option>
                                    <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                    <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                    <option value="Honduras">Honduras</option>
                                    <option value="Hong Kong">Hong Kong</option>
                                    <option value="Hungary">Hungary</option>
                                    <option value="Iceland">Iceland</option>
                                    <option value="India">India</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                    <option value="Iraq">Iraq</option>
                                    <option value="Ireland">Ireland</option>
                                    <option value="Isle of Man">Isle of Man</option>
                                    <option value="Israel">Israel</option>
                                    <option value="Italy">Italy</option>
                                    <option value="Jamaica">Jamaica</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Jersey">Jersey</option>
                                    <option value="Jordan">Jordan</option>
                                    <option value="Kazakhstan">Kazakhstan</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Kiribati">Kiribati</option>
                                    <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                    <option value="Korea, Republic of">Korea, Republic of</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                                    <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                    <option value="Latvia">Latvia</option>
                                    <option value="Lebanon">Lebanon</option>
                                    <option value="Lesotho">Lesotho</option>
                                    <option value="Liberia">Liberia</option>
                                    <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                    <option value="Liechtenstein">Liechtenstein</option>
                                    <option value="Lithuania">Lithuania</option>
                                    <option value="Luxembourg">Luxembourg</option>
                                    <option value="Macao">Macao</option>
                                    <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                    <option value="Madagascar">Madagascar</option>
                                    <option value="Malawi">Malawi</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Maldives">Maldives</option>
                                    <option value="Mali">Mali</option>
                                    <option value="Malta">Malta</option>
                                    <option value="Marshall Islands">Marshall Islands</option>
                                    <option value="Martinique">Martinique</option>
                                    <option value="Mauritania">Mauritania</option>
                                    <option value="Mauritius">Mauritius</option>
                                    <option value="Mayotte">Mayotte</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                    <option value="Moldova, Republic of">Moldova, Republic of</option>
                                    <option value="Monaco">Monaco</option>
                                    <option value="Mongolia">Mongolia</option>
                                    <option value="Montenegro">Montenegro</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Morocco">Morocco</option>
                                    <option value="Mozambique">Mozambique</option>
                                    <option value="Myanmar">Myanmar</option>
                                    <option value="Namibia">Namibia</option>
                                    <option value="Nauru">Nauru</option>
                                    <option value="Nepal">Nepal</option>
                                    <option value="Netherlands">Netherlands</option>
                                    <option value="Netherlands Antilles">Netherlands Antilles</option>
                                    <option value="New Caledonia">New Caledonia</option>
                                    <option value="New Zealand">New Zealand</option>
                                    <option value="Nicaragua">Nicaragua</option>
                                    <option value="Niger">Niger</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Niue">Niue</option>
                                    <option value="Norfolk Island">Norfolk Island</option>
                                    <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                    <option value="Norway">Norway</option>
                                    <option value="Oman">Oman</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Palau">Palau</option>
                                    <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                    <option value="Panama">Panama</option>
                                    <option value="Papua New Guinea">Papua New Guinea</option>
                                    <option value="Paraguay">Paraguay</option>
                                    <option value="Peru">Peru</option>
                                    <option value="Philippines">Philippines</option>
                                    <option value="Pitcairn">Pitcairn</option>
                                    <option value="Poland">Poland</option>
                                    <option value="Portugal">Portugal</option>
                                    <option value="Puerto Rico">Puerto Rico</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Reunion">Reunion</option>
                                    <option value="Romania">Romania</option>
                                    <option value="Russian Federation">Russian Federation</option>
                                    <option value="Rwanda">Rwanda</option>
                                    <option value="Saint Helena">Saint Helena</option>
                                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                    <option value="Saint Lucia">Saint Lucia</option>
                                    <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                    <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                    <option value="Samoa">Samoa</option>
                                    <option value="San Marino">San Marino</option>
                                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Senegal">Senegal</option>
                                    <option value="Serbia">Serbia</option>
                                    <option value="Seychelles">Seychelles</option>
                                    <option value="Sierra Leone">Sierra Leone</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Slovakia">Slovakia</option>
                                    <option value="Slovenia">Slovenia</option>
                                    <option value="Solomon Islands">Solomon Islands</option>
                                    <option value="Somalia">Somalia</option>
                                    <option value="South Africa">South Africa</option>
                                    <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="Sudan">Sudan</option>
                                    <option value="Suriname">Suriname</option>
                                    <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                    <option value="Swaziland">Swaziland</option>
                                    <option value="Sweden">Sweden</option>
                                    <option value="Switzerland">Switzerland</option>
                                    <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                    <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                                    <option value="Tajikistan">Tajikistan</option>
                                    <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                    <option value="Thailand">Thailand</option>
                                    <option value="Timor-leste">Timor-leste</option>
                                    <option value="Togo">Togo</option>
                                    <option value="Tokelau">Tokelau</option>
                                    <option value="Tonga">Tonga</option>
                                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                    <option value="Tunisia">Tunisia</option>
                                    <option value="Turkey">Turkey</option>
                                    <option value="Turkmenistan">Turkmenistan</option>
                                    <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                    <option value="Tuvalu">Tuvalu</option>
                                    <option value="Uganda">Uganda</option>
                                    <option value="Ukraine">Ukraine</option>
                                    <option value="United Arab Emirates">United Arab Emirates</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                    <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                    <option value="Uruguay">Uruguay</option>
                                    <option value="Uzbekistan">Uzbekistan</option>
                                    <option value="Vanuatu">Vanuatu</option>
                                    <option value="Venezuela">Venezuela</option>
                                    <option value="Viet Nam">Viet Nam</option>
                                    <option value="Virgin Islands, British">Virgin Islands, British</option>
                                    <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                    <option value="Wallis and Futuna">Wallis and Futuna</option>
                                    <option value="Western Sahara">Western Sahara</option>
                                    <option value="Yemen">Yemen</option>
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                                <input type="text" required name="state" placeholder="State / Province / Region *" value='{{ $info["state"] ?? "" }}'>
                                <input type="text" required name="city" placeholder="City*" value='{{ $info["city"] ?? "" }}'>
                                <input type="text" required name="mobileNo" placeholder="Mobile Phone *" value='{{ $info["mobileNo"] ?? "" }}'>
                                <input type="text" name="faxNo" placeholder="Fax" value='{{ $info["faxNo"] ?? "" }}'>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="order-message">
                            <p>Shipping Order</p>
                            <textarea name="message" placeholder="Notes about your order, Special Notes for Delivery" rows="16">{{ $info["message"] ?? "" }}</textarea>
                            <label><input type="checkbox" disabled checked> Shipping to bill address</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="review-payment">
            <h2>Review & Payment</h2>
        </div>

        @include('inc.cartTable')

        <div id="paypal-button-container">
        </div>

        <!-- <div class="payment-options">
            <span>
                <label><input type="checkbox"> Direct Bank Transfer</label>
            </span>
            <span>
                <label><input type="checkbox"> Check Payment</label>
            </span>
            <span>
                <label><input type="checkbox"> Paypal</label>
            </span>
        </div> -->
    </div>
</section>
<!--/#cart_items-->

@endsection

@section('self_script')

<script src="https://www.paypal.com/sdk/js?client-id=AZIXtQNbG-snxY90GNo1irVBGhJFy-4_NYPGps4LOiF46T33uyb4R7p16Yg209UFqURoowVfXOXe-Aa5"></script>

<script src="js/cart.js"></script>

<script>
    $('select#country').val('{{ $info["country"] ?? "Sri Lanka" }}')


    function purchase() {
        update()

        if (!$("#billForm")[0].reportValidity()) return;

        $.ajax({
            url: '/checkout/submit',
            type: 'POST',
            data: new FormData($('#billForm')[0]),
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(result) {
                console.log(result)

                if (!result.state) {
                    alert('Submission Failed, Check form details\nError: ' + result.error);
                    return;
                }

                $('#paypal-button-container').html('');

                paypal.Buttons({
                    // createOrder: function(data, actions) {
                    //     return actions.order.create({
                    //         purchase_units: [{
                    //             amount: {
                    //                 value: `${formatLimitDecimals(totalSum / result.conversionRate,2)}`
                    //             }
                    //         }]
                    //     });
                    // },
                    createOrder: function() {
                        return fetch('/create-paypal-transaction', {
                            method: 'get',
                            headers: {
                                'content-type': 'application/json'
                            }
                        }).then(function(res) {
                            return res.json();
                        }).then(function(data) {
                            console.log(data.result.id)
                            return data.result.id; // Use the same key name for order ID on the client and server
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            // Call your server to save the transaction
                            return fetch('/paypal-transaction-complete', {
                                method: 'post',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    orderId: data.orderID,
                                    // conversionRate: result.conversionRate,
                                    // sha256: result.sha256,
                                    _token: '{{csrf_token()}}'
                                })
                            });
                        });
                    },

                    onCancel: function(data, actions) {
                        console.log('cancel')
                    },

                    onError: function(err) {
                        console.log('error')
                    },
                }).render('#paypal-button-container');






            },
            error: function(jqXHR, exception) {
                // msg = errorfunction(jqXHR, exception)

            }
        });

    }
</script>

@endsection