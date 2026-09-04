<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('carts:check-abandoned')->dailyAt('10:00');