/* global jQuery, Qunit, module, console,
  asyncTest, test, expect, ok, start, equal, notEqual */
(function ($) {

  module("Document Tests");
  test("initialize, properties, and destroy", function () {
    expect(8);

    var delay = (Math.ceil(Math.random() * 5) + 5) * 100;

    $.activity(delay);
    var activityTimer = $(document).data("activityTimer");
    notEqual(activityTimer, null, "activityTimer should not be null");

    equal(activityTimer.delay, delay, "activityTimer delay should match");
    ok(activityTimer.running, "activityTimer should be running");

    var elapsedTime = activityTimer.getElapsedTime(),
        remainingTime = activityTimer.getRemainingTime();
    ok($.type(elapsedTime), "number",
      "activityTimer elapsedTime should be a number");

    ok(elapsedTime >= 0,
      "activityTimer elapsedTime >= 0");

    ok($.type(remainingTime), "number",
      "activityTimer elapsedTime should be a number");

    ok(remainingTime >= 0,
      "activityTimer remainingTime >= 0");

    activityTimer.destroy(); // or $.activity("destroy");
    equal($(document).data("activityTimer"), null,
      "activityTimer should be null");

  });
  asyncTest("idle event triggered", function () {
    expect(4);

    $(document).on("activity.idle", function (event, activityTimer) {
      ok(true, "idle fires at document");
      ok(activityTimer.idle, "activityTimer is idle");
      ok(!activityTimer.active, "activityTimer is not active");

      activityTimer.destroy();
      equal($(document).data("activityTimer"), null,
        "activityTimer should be null");

      start();
    });

    $.activity(100);
  });
  asyncTest("active event triggered", function () {
    expect(4);
    $(document).on("activity.active", function (event, activityTimer) {

      ok(true, "active fires at document");
      ok(!activityTimer.idle, "activityTimer is not idle");
      ok(activityTimer.active, "activityTimer is active");

      $.activity("destroy");
      equal($(document).data("activityTimer"), null,
        "activityTimer should be null");

      start();
    });

    $.activity(100);
    setTimeout(function () {
      $("#qunit").trigger("keydown");
    }, 100);
  });

  module("Element Tests");
  asyncTest("idle event triggered", function () {
    expect(4);

    $("#qunit").on("activity.idle",
      function (event, activityTimer) {
        if (event) {
          event.stopPropagation(); // stop propagation for document tests
        }

        ok(true, "idle fires at element");
        ok(activityTimer.idle, "activityTimer for element is idle");
        ok(!activityTimer.active, "activityTimer for element is not active");

        activityTimer.destroy();
        equal($("#qunit").data("activityTimer"), null,
          "activityTimer for element should be null");

        start();
      });

    $("#qunit").activity(100);
  });
  asyncTest("active event triggered", function () {
    expect(4);
    $("#qunit").on("activity.active",
      function (event, activityTimer) {
        if (event) {
          event.stopPropagation(); // stop propagation for document tests
        }

        ok(true, "active fires at element");
        ok(!activityTimer.idle, "activityTimer for element is not idle");
        ok(activityTimer.active, "activityTimer for element is active");

        $.activity("destroy");
        equal($("#qunit").data("activityTimer"), null,
          "activityTimer for element should be null");

        start();
      });

    $("#qunit").activity(100);
    setTimeout(function () {
      $("#qunit").trigger("keydown");
    }, 100);
  });

  module("Functional Tests");
  asyncTest("start, pause, stop methods", function () {
    expect(5);

    $("#qunit-fixture").activity({delay: 100, startImmediately: false});
    var activityTimer = $("#qunit-fixture").data("activityTimer");
    ok(!activityTimer.running, "activityTimer should not be running");
    activityTimer.start();
    ok(activityTimer.running, "activityTimer should be running");

    $("#qunit-fixture").on("activity.idle",
      function (event, activityTimer) {
        if (event) {
          event.stopPropagation(); // stop propagation for document tests
        }

        activityTimer.pause();
        ok(activityTimer.idle && activityTimer.paused,
          "activityTimer should be idle and paused");
        setTimeout(function () {
          activityTimer.start();
          $("#qunit-fixture").trigger("keydown");
        });
      });
    $("#qunit-fixture").on("activity.active",
      function (event, activityTimer) {
        if (event) {
          event.stopPropagation(); // stop propagation for document tests
        }

        ok(activityTimer.active && !activityTimer.paused,
          "activityTimer should be active and not paused");

        activityTimer.stop();
        setTimeout(function () {
          ok(activityTimer.active && !activityTimer.running,
            "activityTimer should be active and not running");
          start();
        }, 100);
      });
    $("#qunit-fixture").trigger("keydown");

  });

})(jQuery);
