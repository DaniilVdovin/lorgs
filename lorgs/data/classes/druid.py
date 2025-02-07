"""Define the Druid Class and all its Specs and Spells."""
# pylint: disable=line-too-long
# pylint: disable=bad-whitespace
# pylint: disable=wildcard-import
# pylint: disable=unused-wildcard-import
# fmt: off

# IMPORT LOCAL LIBRARIES
from lorgs.data.constants import *
from lorgs.data.roles import *
from lorgs.models.wow_class import WowClass
from lorgs.models.wow_spec import WowSpec
from lorgs.models.wow_spell import SpellTag, WowSpell


################################################################################
# Class
#
DRUID = WowClass(id=11, name="Druid", color="#FF7C0A")

################################################################################
# Specs
#
DRUID_BALANCE     = WowSpec(role=RDPS, wow_class=DRUID, name="Balance")
DRUID_FERAL       = WowSpec(role=MDPS, wow_class=DRUID, name="Feral")
DRUID_GUARDIAN    = WowSpec(role=TANK, wow_class=DRUID, name="Guardian")
DRUID_RESTORATION = WowSpec(role=HEAL, wow_class=DRUID, name="Restoration", short_name="Resto")

################################################################################
# Spells
#
DRUID.add_spell(             spell_id=391528, cooldown=60,  duration=4,  color=COL_NF,    name="Convoke the Spirits",            icon="ability_ardenweald_druid.jpg", tags=[SpellTag.RAID_CD])
DRUID.add_spell(             spell_id=323546, cooldown=180, duration=20, color=COL_VENTR, name="Ravenous Frenzy",                icon="ability_revendreth_druid.jpg",              show=False)

# Utils
DRUID.add_spell(             spell_id=106898, cooldown=120, duration=11,                  name="Stampeding Roar",                icon="spell_druid_stampedingroar_cat.jpg",        show=False, variations=[77764, 77761])   # duration includes Conduit
DRUID.add_spell(             spell_id=124974, cooldown=90,  duration=30,                  name="Nature's Vigil",                 icon="achievement_zone_feralas.jpg",              show=False)


# Defensives
DRUID.add_spell(             spell_id=22812, cooldown=60, duration=12, name="Barkskin",                icon="spell_nature_stoneclawtotem.jpg",              show=False)

BEAR_FORM = WowSpell(spell_id=5487, name="Bear Form", icon="ability_racial_bearform.jpg", show=False, event_type="applybuff")
BEAR_FORM.spell_type = DRUID.name_slug
BEAR_FORM.color = DRUID.color
DRUID_BALANCE.add_buff(BEAR_FORM)
DRUID_FERAL.add_buff(BEAR_FORM)
DRUID_RESTORATION.add_buff(BEAR_FORM)


# Offensive
DRUID_BALANCE.add_spell(     spell_id=194223, cooldown=180, duration=20,                  name="Celestial Alignment",            icon="spell_nature_natureguardian.jpg")
DRUID_BALANCE.add_spell(     spell_id=102560, cooldown=180, duration=30,                  name="Incarnation: Chosen of Elune",   icon="spell_druid_incarnation.jpg", variations=[383410])
DRUID_BALANCE.add_spell(     spell_id=205636, cooldown=60,  duration=10,                  name="Force of Nature",                icon="ability_druid_forceofnature.jpg",           show=False)
DRUID_BALANCE.add_spell(     spell_id=202770, cooldown=60,  duration=8,                   name="Fury of Elune",                  icon="ability_druid_dreamstate.jpg",              show=False)

DRUID_FERAL.add_spell(       spell_id=106951, cooldown=120, duration=15,                  name="Berserk",                        icon="ability_druid_berserk.jpg", variations=[102543])
DRUID_FERAL.add_spell(       spell_id=58984,  cooldown=120,              color="#999999", name="Shadowmeld ",                    icon="ability_ambush.jpg",                        show=False)
DRUID_FERAL.add_spell(       spell_id=108291, cooldown=300, duration=45, color="#fcdf03", name="Hearth of the Wild ",            icon="spell_holy_blessingofagility.jpg")
DRUID_FERAL.add_buff(        spell_id=197625,                            color="#11cff5", name="Moonkin Form ",                  icon="spell_nature_forceofnature.jpg")

DRUID_GUARDIAN.add_spell(    spell_id=108292, cooldown=300, duration=45, color="#fcdf03", name="Heart of the Wild",              icon="spell_holy_blessingofagility.jpg",          show=False)
DRUID_GUARDIAN.add_spell(    spell_id=61336,  cooldown=180, duration=6,                   name="Survival Instincts",             icon="ability_druid_tigersroar.jpg")
DRUID_GUARDIAN.add_spell(    spell_id=102558, cooldown=180, duration=30,                  name="Incarnation: Guardian of Ursoc", icon="spell_druid_incarnation.jpg", variations=[50334])
DRUID_GUARDIAN.add_spell(    spell_id=22812,  cooldown=60,  duration=8,                   name="Barkskin",                       icon="spell_nature_stoneclawtotem.jpg",           show=False)

DRUID_RESTORATION.add_spell( spell_id=197721, cooldown=90,  duration=8,  color="#7ec44d", name="Flourish",                       icon="spell_druid_wildburst.jpg",                 show=False, tags=[SpellTag.RAID_CD])
DRUID_RESTORATION.add_spell( spell_id=740,    cooldown=120, duration=6,  color="#6cbfd9", name="Tranquility",                    icon="spell_nature_tranquility.jpg", tags=[SpellTag.RAID_CD])
DRUID_RESTORATION.add_buff(  spell_id=33891,  cooldown=0,   duration=0,                   name="Incarnation: Tree of Life",      icon="ability_druid_improvedtreeform.jpg", wowhead_data="spell=33891", tags=[SpellTag.RAID_CD])


# Additional Spells (not tracked)
REBIRTH = WowSpell(spell_id=20484, name="Rebirth", icon="spell_nature_reincarnation.jpg")
