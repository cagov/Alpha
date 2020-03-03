<%@ Page Language="C#" %>
<% 
Response.StatusCode = 500;
Response.TrySkipIisCustomErrors = true; 
%>

<!doctype html>
<html lang="en" xml:lang="en">

<head>
    <%= require('html-loader!../../partials/meta-common.html') %>
    <%= require('html-loader!../../partials/favicons.html') %>
  	<meta name="description" content="Find out if you’re eligible for the California LifeLine Program, a discounted phone service.">
  	<title>Check if you can get a discounted phone service (California LifeLine) - Alpha.CA.gov</title>
	<!-- Social media post -->
    <meta property="og:image" content="/img/thumbnail.png">
    <meta property="og:image:height" content="630">
    <meta property="og:image:width" content="630">
    <meta property="og:title" content="Check if you can get a discounted phone service (California LifeLine) - Alpha.CA.gov">
    <meta property="og:description" content="Find out if you’re eligible for the California LifeLine Program, a discounted phone service.">
    <meta property="og:url" content="[code-url]">
    <link rel="canonical" href="[code-url]" />
	<link href="https://california.azureedge.net/cdt/statetemplate/6.0.0/css/cagov.font-only.min.css" rel="stylesheet" />
</head>

<body>
 
<header>
	<%= require('html-loader!../../partials/official.html') %>
	<%= require('html-loader!../../partials/experiment-banner.html') %>
	<%= require('html-loader!../../partials/navbar.html') %>
</header>