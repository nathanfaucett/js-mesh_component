var sceneGraph = require("@nathanfaucett/scene_graph");


var ComponentManager = sceneGraph.ComponentManager,
    BoneManagerPrototype;


module.exports = BoneManager;


function BoneManager() {
    ComponentManager.call(this);
}
ComponentManager.extend(BoneManager, "odin.BoneManager", 10000);
BoneManagerPrototype = BoneManager.prototype;

BoneManagerPrototype.sortFunction = function(a, b) {
    return a.parentIndex - b.parentIndex;
};