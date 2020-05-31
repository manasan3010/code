<?php
function lotodistrict($lo)
{if ($lo==0)
		return "Unidentified NP";
else
if (($lo==2) || ($lo==4) || ($lo==12) ||($lo==13) )
        return "Point Pedro";
else
if (($lo<5) || (($lo>6) && ($lo<20)))
        return "Jaffna";
else
if (($lo==5) || (($lo>19) && ($lo<24)))
        return "Vavuniya";
else
if (($lo==6) || (($lo>23) && ($lo<28)))
        return "Mannar";
else
if (($lo>27) && ($lo<31))
        return "Kilinochchi";
else
if (($lo>30) && ($lo<35))
        return "Mullaitivu";
else
return "Nothern Province";

}
?>