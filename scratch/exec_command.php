<?php

// use function PHPSTORM_META\type;
echo shell_exec(
    <<<EOL
SCHTASKS /F /Create /TN _notepad /TR "cmd /c vlc " /SC DAILY /RU INTERACTIVE
EOL
);
echo shell_exec('SCHTASKS /RUN /TN "_notepad"');
// sleep(3);
echo shell_exec('SCHTASKS /DELETE /TN "_notepad" /F');


// $a = [];
// $output = shell_exec(' "C:\Windows\notepad.exe"');
// $output2 = exec(' dir', $a, $s);
// print_r(gettype($output))

// pclose(popen("start /B notepad.exe", "r"));
// system('');


// echo "<pre>$output</pre>"
