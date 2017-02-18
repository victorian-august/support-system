<?php

namespace SmartcatSupport\util;

class TemplateUtils {
    private function __construct() {}

    public static function convert_html_chars( $text ) {
        $matches = array();

        preg_match_all('#<code>(.*?)</code>#', $text, $matches);

        foreach ($matches[1] as $match) {
            $text = str_replace($match, htmlspecialchars($match), $text);
        }

        return $text;
    }
}