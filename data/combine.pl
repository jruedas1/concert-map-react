#!/usr/bin/perl

use strict;
use warnings;
use JSON;

# Read venues file
open(my $venues_file, '<', 'venues.json') or die "Could not open venues.json: $!";
my $venues_data = decode_json(join('', <$venues_file>));
close($venues_file);

# Read events file
open(my $events_file, '<', 'events.json') or die "Could not open events.json: $!";
my $events_data = decode_json(join('', <$events_file>));
close($events_file);

# Hash to store venues by name
my %venues_by_name;
foreach my $venue (@{$venues_data}) {
    $venues_by_name{$venue->{'name'}} = $venue;
}

# Add concerts to venues
foreach my $event (@{$events_data}) {
    my $venue_name = $event->{'Venue'};
    if (exists $venues_by_name{$venue_name}) {
        push @{$venues_by_name{$venue_name}->{'concerts'}}, $event;
    } else {
        warn "Venue '$venue_name' not found in venues data.\n";
    }
}

# Write output file
my $output_data = {'venues' => []};
foreach my $venue_name (keys %venues_by_name) {
    push @{$output_data->{'venues'}}, $venues_by_name{$venue_name};
}

open(my $output_file, '>', 'output.json') or die "Could not open output.json for writing: $!";
print $output_file encode_json($output_data);
close($output_file);

print "Output file 'output.json' generated successfully.\n";
