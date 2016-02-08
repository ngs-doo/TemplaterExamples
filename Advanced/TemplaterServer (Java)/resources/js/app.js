angular.module('templaterApp', ['ui.bootstrap', 'ui.ace'])
.controller('templaterCtrl', function($scope, $modal, $http, $attrs) {
  // hacky? way to keep $scope.jd and ace editor model in sync
  // problem: when you start editing inside the editor, changes are not propagated to $scope.jd
  // also, ace looses bindings or something and when you change $scope.jd ace does not get the change
  // preparing placeholder methods, will be filled on ACE init method @see init() function
  var aceSync = {
    toAce: function() {},
    fromAce: function() {}
  };

  // also, DO NOT just set $scope.jd without calling aceSync.toAce()
  var setJdValue = function(value) {
    $scope.jd = value;
    // workaround so ACE gets new value
    aceSync.toAce($scope.jd);
  }

  $scope.toPdf = false;
  $scope.toPdfState = "ON";
  $scope.selectedTemplate = "";
  $scope.templateType = "";
  $scope.processButtonText = 'Select the template';
  $scope.getTemplateText = 'Select the template';
  $scope.demoPath = (!$attrs.demo) ? "" : $attrs.demo;
  $scope.templateDownloadLink = $scope.demoPath + "template" + $scope.selectedTemplate;
  $scope.templateList = templates;

  $scope.selectTemplate = function(template) {
    giveExample(template)
    $scope.selectedTemplate = template
    var selectedTemplate = $scope.selectedTemplate
    var templateType = selectedTemplate.substring(selectedTemplate.lastIndexOf('.') + 1)
    $scope.templateType = templateType
    if (templateType != "docx") $scope.toPdf = false

    $scope.getTemplateText = 'Download ' + $scope.selectedTemplate
    updateToPdfStateText()
    updateProcessButtonStateText()
  };

  $scope.pdfChange = function() {
    $scope.toPdf = (($scope.templateType == 'docx') && !$scope.toPdf)
    updateToPdfStateText()
    updateProcessButtonStateText()
  }

  var updateProcessButtonStateText = function() {
    if ($scope.selectedTemplate != "") {
      var toPdf = $scope.toPdf
      $scope.processButtonText = 'Create ' + (toPdf && 'pdf' || !toPdf && $scope.templateType) + ' document with ' + $scope.selectedTemplate
    }
  }

  var updateToPdfStateText = function() {
    $scope.toPdfState = $scope.toPdf ? 'ON' : 'OFF'
  }

  $scope.processTemplate = function() {
    var jd = $scope.jd
    try {
      $.parseJSON(jd)
      sendTemplaterRequest(jd, $scope.selectedTemplate)
    } catch (e) {
      $modal.open({
        templateUrl: '/static/dialogSend.html',
        controller: 'dialogSend',
        resolve: {
          jd: function() {
            return jd;
          }
        }
      }).result.then(
        function(resp) {
          sendTemplaterRequest(resp, selectedTemplate)
          console.log(resp);
        },
        function(resp) {
          $('div.info').html(resp);
        }
      );
    }
  };

  $scope.getSelectedTemplate = function() {
    if ($scope.selectedTemplate != "") {
      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", $scope.demoPath + "/templates/" + $scope.selectedTemplate);
      iframe.setAttribute("style", "display: none");
      document.body.appendChild(iframe)
    }
  }

  var giveExample = function(template) {
    $http.get($scope.demoPath + '/examples/' + template + ".json").then(
      function(resp) {
        setJdValue(JSON.stringify(resp.data, null, "\t"));
      },
      function(resp) {
        setJdValue(resp.data);
      });
  }

  $scope.beautifyJSON = function() {
    try {
      var jObj = $.parseJSON($scope.jd);
      setJdValue(JSON.stringify(jObj, null, "\t"));
    } catch (e) {
      $('div.info').html(e);
    }
  };

  var sendTemplaterRequest = function(json, template) {
    try {
      $.parseJSON(json);
      var post = $('#post_action');
      post.attr('action', $scope.demoPath + '/process?toPdf=' + $scope.toPdf + '&template=' + template);
      $('#post_json').val(json);
      post.submit();
    } catch (e) {
      $('div.info').html(e);
    }
  }

  // init templates list and show a default, invoked when ACE editor is ready
  var init = function(aceInstance) {
    // keep everything in sync - hack
    // fill placeholder methods so data is updated
    aceSync.toAce = function(jdValue) {
      //console.log('manually setting value jd -> ace');
      // set value and move cursor to start so text is not selected
      aceInstance.setValue(jdValue, -1);
    };

    aceSync.fromAce = function() {
      if ($scope.jd != aceInstance.getValue()) {
        $scope.jd = aceInstance.getValue();
      }
    };

    giveExample("BeerList.docx");

    return;
  }

  // The ui-ace option
  $scope.aceOption = {
    theme: "chrome",
    mode: "json",
    onLoad: init,
    onChange: function() {
      aceSync.fromAce();
    }
  };
});
