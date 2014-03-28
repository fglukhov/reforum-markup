<?php
if(isset($_GET['path'])){
	$path = trim(strip_tags(strval($_GET['path'])));
	$path = str_replace('?','',$path);
	$path = trim(str_replace('&','',$path));
	$p='';
	if(isset($_GET['p'])) $p='?p='.trim(strip_tags(strval($_GET['p'])));
	if($p!='' and strlen<10) $path = $path.$p;
	if($path!=''){
		$html = file_get_contents('http://umi.winningthehearts.com/'.$path); 
		$temp = explode('<body>',$html);
		if(isset($temp[1]))	$html = $temp[1];
		$html = str_replace('src="/','src="http://umi.winningthehearts.com/',$html);
		$html = str_replace('href="/','href="/umi/',$html);
		$html = str_replace('&lt;','<',$html);
		$html = str_replace('&gt;','>',$html);
		if(isset($temp[1]))	$html = $temp[0].'<body>'.$html;
		print_r($html);
		exit();
	}	
}
header( "HTTP/1.1 301 Moved Permanently" ); 
header('location: /');
exit();		
?>
