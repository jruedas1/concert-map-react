#!/usr/bin/perl

use strict;
use warnings;

# Read venues file
open(my $venues_file, '<', 'venues.json') or die "Could not open venues.json: $!";
my $venues_content = do { local $/; <$venues_file> }; # Read entire file content
close($venues_file);

print "Venues Content:\n$venues_content\n";
