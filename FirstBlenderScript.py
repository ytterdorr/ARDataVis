import bpy

f = open("/home/ytterdorr/co2.csv", "r")
lines = [line.rstrip() for line in f]
columns = lines[0]
countryData = {}

materials = {}
colors = {
    "blue": (0, 0, 1, 1),
    "red": (1, 0, 0, 1)
}
blueMat = bpy.data.materials.new(name="blueMat")
blueMat.use_nodes = True
blueMat.node_tree.nodes["Principled BSDF"].inputs[0].default_value = colors["blue"]

materials["blue"] = blueMat

for line in lines[1:]:
    split = line.split(",")
    countryName = split[0]
    data = [float(x) for x in split[1:]]
    countryData[countryName] = { "data": data, "name": countryName}

BOX_SCALE = 0.1  

def createBar(height):
    pass
    


#print("countryData:", countryData)

# yPos = 0
# for countryName in countryData:
#     xPos = 0
#     for dp in countryData[countryName]["data"]:
#         print("Data:", dp)
#         height = dp
        
#         # Create cubes
#         bpy.ops.mesh.primitive_cube_add(size=BOX_SCALE, location=(1, 1, 1))
#         ob = bpy.context.object
        
#         # Move
#         ob.scale[2] = height
#         ob.location = [xPos, yPos, height*BOX_SCALE/2]
#         # Update xPos
#         xPos += BOX_SCALE*1.1
#     yPos += BOX_SCALE*1.1    
    
height = 15
Create cubes
bpy.ops.mesh.primitive_cube_add(size=BOX_SCALE, location=(1, 1, 1))

ob = bpy.context.object
ob.scale[2] = height
ob.location = [0, 0, height*BOX_SCALE/2]


# Create text
#bpy.ops.object.text_add(location=(0, 0, 0))
#bpy.context.object.data.body = "My Text"

#bpy.data.objects["Text"].data.body = 'New Text'
#bpy.data.materials["Material.001"].node_tree.nodes["Principled BSDF"].inputs[0].default_value = (0.8, 0.0077481, 0.0111964, 1)