//self.port.on("getElements", function(tag) {
    $(document).ready(executePlugin);
//});

function executePlugin() {
    $('#plugincheck').attr('data-plugincheck', 'true');
    var plugincheck = $('#plugincheck').attr('data-plugincheck');
    $.getJSON('https://api.mongolab.com/api/1/databases/weolopez/collections/InventorySpaces?apiKey=50f36e05e4b0b9deb24829a0', function(data) {
        $.each(data, function(i, item) {
            if (document.URL.contains(item.ce.prodURL))
                if (document.URL.contains(item.page.path)) {
                    $.each(item.catalogs, function(j, catalog) {
                        if (catalog.isEnabled === 'true') {
                            var o = {};
                            o.offerRecord = [];
                            var width = catalog.template.size.substr(0, catalog.template.size.indexOf('x'));
                            var height = catalog.template.size.substr(catalog.template.size.indexOf('x') + 1, catalog.template.size.length);
                            catalog.defaultContent.selector = item.selector;
                            catalog.defaultContent.inventorySpaceId = item.name;
                            catalog.defaultContent.height = height;
                            catalog.defaultContent.width = width;
                            catalog.defaultContent.template = catalog.template.html;
                            catalog.defaultContent.statusCode = '100';
                            o.offerRecord.push(catalog.defaultContent);
                            $().executeDataTdata(o);
                        }
                        ;
                    });
                }
            ;
        });
    });
}        